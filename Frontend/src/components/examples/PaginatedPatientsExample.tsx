import React from 'react';
import { PaginatedTable } from '@/components/ui/paginated-table';
import { PaginatedList } from '@/components/ui/paginated-list';
import { PaginatedGrid } from '@/components/ui/paginated-grid';
import { usePaginatedPatients } from '@/hooks/usePaginatedData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { Patient } from '@/types/patient';

export const PaginatedPatientsExample: React.FC = () => {
  const { data, pagination, loading, error, actions } = usePaginatedPatients();

  const columns = [
    {
      key: 'patientCode',
      header: 'Mã bệnh nhân',
      className: 'font-medium'
    },
    {
      key: 'fullName',
      header: 'Họ và tên'
    },
    {
      key: 'phone',
      header: 'Số điện thoại'
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (value: string) => (
        <Badge variant={value === 'ACTIVE' ? 'default' : 'secondary'}>
          {value === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (value: any, item: Patient) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const renderPatientCard = (patient: Patient) => (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{patient.fullName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Mã: {patient.patientCode}</p>
          <p>SĐT: {patient.phone}</p>
          <p>Email: {patient.email}</p>
          <Badge variant={patient.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
            {patient.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
          </Badge>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            Xem
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Sửa
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPatientListItem = (patient: Patient) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium">{patient.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.patientCode} • {patient.phone} • {patient.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={patient.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {patient.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
            <div className="flex gap-1">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ví dụ Pagination - Bệnh nhân</h2>
        <p className="text-muted-foreground">
          Các ví dụ về pagination với table, list và grid layout
        </p>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Table Pagination</h3>
            <PaginatedTable
              data={data}
              columns={columns}
              pagination={pagination}
              loading={loading}
              error={error}
              emptyMessage="Không có bệnh nhân nào"
              stickyPagination={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">List Pagination</h3>
            <PaginatedList
              data={data}
              renderItem={renderPatientListItem}
              pagination={pagination}
              loading={loading}
              error={error}
              emptyMessage="Không có bệnh nhân nào"
              paginationPosition="both"
              showPaginationOnTop={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="grid">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Grid Pagination</h3>
            <PaginatedGrid
              data={data}
              renderItem={renderPatientCard}
              pagination={pagination}
              loading={loading}
              error={error}
              emptyMessage="Không có bệnh nhân nào"
              columns={4}
              gap="4"
              paginationVariant="full"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaginatedPatientsExample;
