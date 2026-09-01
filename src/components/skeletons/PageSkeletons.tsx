import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-16 md:pb-0 animate-page-fade">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="hidden md:flex">
          <Skeleton className="h-11 w-36 rounded-md" />
        </div>
      </div>

      {/* Machine Stat Cards Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 border-border space-y-4">
              <div className="flex items-start justify-between">
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent items table skeleton */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card className="border-border p-4">
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function NovoItemSkeleton() {
  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-page-fade max-w-7xl mx-auto">
      <div className="flex items-center gap-3 border-b border-border pb-5">
        <Skeleton className="h-11 w-11 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border space-y-5">
          <Skeleton className="h-6 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-28 w-full rounded-md" />
          </div>
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </Card>

        <Card className="p-6 border-border space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64 w-full rounded-md" />
        </Card>
      </div>
    </div>
  )
}

export function MaquinaDetailSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-page-fade max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Skeleton className="h-11 w-44" />
        <Skeleton className="h-11 w-32" />
      </div>

      <Card className="p-6 border-border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </Card>

      <Card className="p-4 border-border flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-11 w-20" />
          <Skeleton className="h-11 w-24" />
          <Skeleton className="h-11 w-28" />
        </div>
        <Skeleton className="h-11 w-64" />
      </Card>

      <div className="max-w-2xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 border-border space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-16 w-full rounded-md" />
            <div className="flex justify-between pt-3 border-t border-border">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-32 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
