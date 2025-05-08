'use client';
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { FlowHeader } from "../FlowEditor/FlowSidebar/FlowHeader";
import FlowActions from "../FlowActions/FlowActions";

export default function HomeSidebar() {
  return (
    <Card className="w-[300px] min-h-screen rounded-none border-r shadow-none">
      <CardContent className="p-4 flex flex-col gap-4">
        <FlowHeader onAddFlow={() => {}} showButton={false} />
        <FlowActions />
      </CardContent>
    </Card>
  );
} 