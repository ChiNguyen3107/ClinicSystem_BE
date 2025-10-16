import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Rating, RatingStats } from '@/types/public';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RatingListProps {
  ratings: Rating[];
  stats: RatingStats;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export const RatingList: React.FC<RatingListProps> = ({
  ratings,
  stats,
  onLoadMore,
  hasMore = false,
  isLoading = false
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Rating Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Đánh giá tổng quan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <p className="text-sm text-muted-foreground">
                Dựa trên {stats.totalRatings} đánh giá
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Phân bố đánh giá</h4>
              {stats.ratingDistribution.map((dist) => (
                <div key={dist.rating} className="flex items-center gap-2">
                  <span className="text-sm w-2">{dist.rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-medium text-sm mb-2">Hoạt động gần đây</h4>
              <div className="space-y-2">
                {stats.recentRatings.slice(0, 3).map((rating) => (
                  <div key={rating.id} className="flex items-center gap-2 text-sm">
                    <div className="flex">
                      {renderStars(rating.rating)}
                    </div>
                    <span className="text-muted-foreground">
                      {rating.patientName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(rating.createdAt), {
                        addSuffix: true,
                        locale: vi
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Đánh giá từ bệnh nhân</h3>
        
        {ratings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có đánh giá nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <Card key={rating.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={rating.patientName} />
                      <AvatarFallback>
                        {getInitials(rating.patientName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">
                          {rating.isAnonymous ? 'Bệnh nhân ẩn danh' : rating.patientName}
                        </h4>
                        <div className="flex">
                          {renderStars(rating.rating)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {rating.rating} sao
                        </Badge>
                      </div>

                      {rating.comment && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {rating.comment}
                        </p>
                      )}

                      {rating.serviceRating && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">Đánh giá dịch vụ:</span>
                          <div className="flex">
                            {renderStars(rating.serviceRating)}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(rating.createdAt), {
                            addSuffix: true,
                            locale: vi
                          })}
                        </span>
                        {rating.isAnonymous && (
                          <Badge variant="outline" className="text-xs">
                            Ẩn danh
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rating Actions */}
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-muted rounded">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded">
                        <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-md disabled:opacity-50"
                >
                  {isLoading ? 'Đang tải...' : 'Xem thêm đánh giá'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
