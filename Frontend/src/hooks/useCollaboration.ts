import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Cursor {
  id: string;
  userId: string;
  x: number;
  y: number;
  color: string;
  name: string;
  timestamp: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  position?: { x: number; y: number };
  resolved?: boolean;
  replies?: Comment[];
}

export interface CollaborationSession {
  id: string;
  name: string;
  participants: User[];
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

interface UseCollaborationOptions {
  sessionId?: string;
  userId: string;
  userName: string;
  userColor?: string;
  onUserJoin?: (user: User) => void;
  onUserLeave?: (userId: string) => void;
  onCursorMove?: (cursor: Cursor) => void;
  onCommentAdd?: (comment: Comment) => void;
  onCommentUpdate?: (comment: Comment) => void;
}

interface UseCollaborationReturn {
  // Session management
  session: CollaborationSession | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  
  // Users
  onlineUsers: User[];
  currentUser: User | null;
  
  // Cursors
  cursors: Cursor[];
  updateCursor: (x: number, y: number) => void;
  
  // Comments
  comments: Comment[];
  addComment: (content: string, position?: { x: number; y: number }) => void;
  updateComment: (commentId: string, content: string) => void;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  
  // Session actions
  joinSession: (sessionId: string) => void;
  leaveSession: () => void;
  createSession: (name: string) => void;
}

export const useCollaboration = (options: UseCollaborationOptions): UseCollaborationReturn => {
  const {
    sessionId,
    userId,
    userName,
    userColor = '#3b82f6',
    onUserJoin,
    onUserLeave,
    onCursorMove,
    onCommentAdd,
    onCommentUpdate
  } = options;

  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const cursorTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const lastCursorUpdateRef = useRef<number>(0);

  // WebSocket connection
  const { isConnected, isConnecting, sendMessage, error } = useWebSocket({
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws/collaboration',
    onMessage: (message) => {
      handleCollaborationMessage(message);
    },
    onConnect: () => {
      if (sessionId) {
        joinSession(sessionId);
      }
    }
  });

  const handleCollaborationMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'session_joined':
        setSession(message.data.session);
        setOnlineUsers(message.data.users);
        setComments(message.data.comments || []);
        break;

      case 'user_joined':
        const newUser: User = message.data;
        setOnlineUsers(prev => {
          const exists = prev.find(u => u.id === newUser.id);
          if (exists) {
            return prev.map(u => u.id === newUser.id ? newUser : u);
          }
          return [...prev, newUser];
        });
        onUserJoin?.(newUser);
        break;

      case 'user_left':
        const leftUserId = message.data.userId;
        setOnlineUsers(prev => prev.filter(u => u.id !== leftUserId));
        setCursors(prev => prev.filter(c => c.userId !== leftUserId));
        onUserLeave?.(leftUserId);
        break;

      case 'cursor_move':
        const cursor: Cursor = message.data;
        setCursors(prev => {
          const filtered = prev.filter(c => c.userId !== cursor.userId);
          return [...filtered, cursor];
        });
        onCursorMove?.(cursor);
        break;

      case 'comment_added':
        const newComment: Comment = message.data;
        setComments(prev => [...prev, newComment]);
        onCommentAdd?.(newComment);
        break;

      case 'comment_updated':
        const updatedComment: Comment = message.data;
        setComments(prev =>
          prev.map(c => c.id === updatedComment.id ? updatedComment : c)
        );
        onCommentUpdate?.(updatedComment);
        break;

      case 'comment_deleted':
        const deletedCommentId = message.data.commentId;
        setComments(prev => prev.filter(c => c.id !== deletedCommentId));
        break;

      default:
        console.log('Unknown collaboration message type:', message.type);
    }
  }, [onUserJoin, onUserLeave, onCursorMove, onCommentAdd, onCommentUpdate]);

  const joinSession = useCallback((targetSessionId: string) => {
    const user: User = {
      id: userId,
      name: userName,
      email: `${userName}@example.com`,
      color: userColor,
      isOnline: true,
      lastSeen: new Date()
    };

    setCurrentUser(user);
    sendMessage({
      type: 'join_session',
      sessionId: targetSessionId,
      user
    });
  }, [userId, userName, userColor, sendMessage]);

  const leaveSession = useCallback(() => {
    if (session) {
      sendMessage({
        type: 'leave_session',
        sessionId: session.id,
        userId
      });
    }
    setSession(null);
    setOnlineUsers([]);
    setCursors([]);
    setComments([]);
  }, [session, sendMessage, userId]);

  const createSession = useCallback((name: string) => {
    sendMessage({
      type: 'create_session',
      name,
      userId,
      userName
    });
  }, [sendMessage, userId, userName]);

  const updateCursor = useCallback((x: number, y: number) => {
    const now = Date.now();
    
    // Throttle cursor updates to avoid spam
    if (now - lastCursorUpdateRef.current < 50) {
      return;
    }
    lastCursorUpdateRef.current = now;

    if (!currentUser || !session) return;

    const cursor: Cursor = {
      id: `${userId}-cursor`,
      userId,
      x,
      y,
      color: userColor,
      name: userName,
      timestamp: new Date()
    };

    sendMessage({
      type: 'cursor_move',
      sessionId: session.id,
      cursor
    });

    // Clear existing timeout for this user
    const existingTimeout = cursorTimeoutRef.current.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set timeout to remove cursor after 5 seconds of inactivity
    const timeout = setTimeout(() => {
      setCursors(prev => prev.filter(c => c.userId !== userId));
      cursorTimeoutRef.current.delete(userId);
    }, 5000);

    cursorTimeoutRef.current.set(userId, timeout);
  }, [currentUser, session, userId, userColor, userName, sendMessage]);

  const addComment = useCallback((content: string, position?: { x: number; y: number }) => {
    if (!session) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      content,
      timestamp: new Date(),
      position,
      resolved: false
    };

    sendMessage({
      type: 'add_comment',
      sessionId: session.id,
      comment
    });
  }, [session, userId, userName, sendMessage]);

  const updateComment = useCallback((commentId: string, content: string) => {
    if (!session) return;

    sendMessage({
      type: 'update_comment',
      sessionId: session.id,
      commentId,
      content
    });
  }, [session, sendMessage]);

  const resolveComment = useCallback((commentId: string) => {
    if (!session) return;

    sendMessage({
      type: 'resolve_comment',
      sessionId: session.id,
      commentId
    });
  }, [session, sendMessage]);

  const deleteComment = useCallback((commentId: string) => {
    if (!session) return;

    sendMessage({
      type: 'delete_comment',
      sessionId: session.id,
      commentId
    });
  }, [session, sendMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cursorTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
      if (session) {
        leaveSession();
      }
    };
  }, [session, leaveSession]);

  return {
    session,
    isConnected,
    isConnecting,
    error,
    onlineUsers,
    currentUser,
    cursors,
    updateCursor,
    comments,
    addComment,
    updateComment,
    resolveComment,
    deleteComment,
    joinSession,
    leaveSession,
    createSession
  };
};
