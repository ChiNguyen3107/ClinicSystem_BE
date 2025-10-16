import React, { useState } from 'react';
import { Users, MessageSquare, MousePointer, Plus, X, Check, Edit3 } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { Textarea } from './textarea';
import { Input } from './input';
import { useCollaboration, User, Comment } from '@/hooks/useCollaboration';
import { cn } from '@/utils/cn';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CollaborationPanelProps {
  sessionId?: string;
  userId: string;
  userName: string;
  userColor?: string;
  className?: string;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  sessionId,
  userId,
  userName,
  userColor = '#3b82f6',
  className
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'comments'>('users');
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const {
    session,
    isConnected,
    onlineUsers,
    comments,
    addComment,
    updateComment,
    resolveComment,
    deleteComment
  } = useCollaboration({
    sessionId,
    userId,
    userName,
    userColor,
    onUserJoin: (user) => {
      console.log('User joined:', user.name);
    },
    onUserLeave: (userId) => {
      console.log('User left:', userId);
    }
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (editingComment && editContent.trim()) {
      updateComment(editingComment, editContent.trim());
      setEditingComment(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const getStatusColor = (user: User) => {
    return user.isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  const getCommentStatusColor = (comment: Comment) => {
    if (comment.resolved) return 'bg-green-50 border-green-200';
    if (comment.userId === userId) return 'bg-blue-50 border-blue-200';
    return 'bg-white border-gray-200';
  };

  if (!session) {
    return (
      <div className={cn('bg-white rounded-lg border p-6 text-center', className)}>
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có phiên cộng tác
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Tham gia hoặc tạo phiên cộng tác để bắt đầu làm việc cùng nhau
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className={cn(
            'w-2 h-2 rounded-full',
            isConnected ? 'bg-green-500' : 'bg-red-500'
          )} />
          {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{session.name}</h3>
            <p className="text-sm text-gray-500">
              {onlineUsers.length} người tham gia • {comments.length} bình luận
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              isConnected ? 'bg-green-500' : 'bg-red-500'
            )} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'users'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          <Users className="h-4 w-4" />
          Người dùng ({onlineUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'comments'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Bình luận ({comments.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'users' ? (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={cn(
                        'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
                        getStatusColor(user)
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                    </p>
                  </div>
                  {user.id === userId && (
                    <Badge variant="secondary" className="text-xs">
                      Bạn
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="space-y-4">
            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Thêm bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm bình luận
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={cn(
                      'p-3 rounded-lg border',
                      getCommentStatusColor(comment)
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: userColor }}
                        >
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {comment.userName}
                        </span>
                        {comment.resolved && (
                          <Badge variant="default" className="text-xs">
                            Đã giải quyết
                          </Badge>
                        )}
                      </div>
                      {comment.userId === userId && !comment.resolved && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditComment(comment)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resolveComment(comment.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteComment(comment.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Hủy
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim()}
                          >
                            Lưu
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 mb-2">
                        {comment.content}
                      </p>
                    )}

                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(comment.timestamp, {
                        addSuffix: true,
                        locale: vi
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
