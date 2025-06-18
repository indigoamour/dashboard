"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import APIList from "@/components/ui/api-list";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.storeId;

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders [${data.length}]`}
          description="Manage orders for your store"
        />
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />
    </>
  );
};

export default OrderClient;
