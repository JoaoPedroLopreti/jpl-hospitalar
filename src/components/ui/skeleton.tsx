import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-200",
                className
            )}
            {...props}
        />
    )
}

export function CardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="ml-4 flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        </div>
    )
}

export function TableRowSkeleton() {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
        </div>
    )
}

export function InputSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>

                {/* Stats Skeleton */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>

                {/* Recent Proposals Skeleton */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="space-y-4">
                        <TableRowSkeleton />
                        <TableRowSkeleton />
                        <TableRowSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}
