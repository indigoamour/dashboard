"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import APIList from "@/components/ui/api-list";

interface BillboardClientProps {
  data: BillboardColumn[];
}

const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.storeId; 

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards [${data.length}]`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${storeId}/billboards/new`)}
          className="mr-2"
        >
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="API calls for Billboards" />
      <Separator />
      <APIList entityIdName="billboardId" entityName="billboards" />
    </>
  );
};

export default BillboardClient;
