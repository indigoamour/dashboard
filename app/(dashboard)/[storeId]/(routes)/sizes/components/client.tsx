"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import APIList from "@/components/ui/api-list";

interface SizesClientProps {
  data: SizeColumn[];
}

const SizesClient: React.FC<SizesClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.storeId; 

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes [${data.length}]`}
          description="Manage sizes for your store"
        />
        <Button
          onClick={() => router.push(`/${storeId}/sizes/new`)}
          className="mr-2"
        >
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Sizes" />
      <Separator />
      <APIList entityIdName="sizeId" entityName="sizes" />
    </>
  );
};

export default SizesClient;
