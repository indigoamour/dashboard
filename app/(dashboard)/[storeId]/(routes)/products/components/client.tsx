"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import APIList from "@/components/ui/api-list";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.storeId;

  console.log(data)

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products [${data.length}]`}
          description="Manage products for your store"
        />
        <Button
          onClick={() => router.push(`/${storeId}/products/new`)}
          className="mr-2"
        >
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="API calls for products" />
      <Separator />
      <APIList entityIdName="productId" entityName="products" />
    </>
  );
};

export default ProductClient;
