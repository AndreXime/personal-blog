"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < totalPages ? currentPage + 1 : null

  return (
    <div className="flex justify-center items-center space-x-2">
      <Link
        href={prevPage ? `/blog/page/${prevPage}` : "#"}
        className={`flex items-center px-3 py-2 rounded-md ${
          prevPage ? "hover:bg-slate-100" : "opacity-50 cursor-not-allowed"
        }`}
        aria-disabled={!prevPage}
        tabIndex={!prevPage ? -1 : undefined}
        onClick={(e) => !prevPage && e.preventDefault()}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Link>

      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={page === 1 ? "/blog" : `/blog/page/${page}`}
            className={`px-3 py-1 rounded-md ${
              currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-slate-100"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        href={nextPage ? `/blog/page/${nextPage}` : "#"}
        className={`flex items-center px-3 py-2 rounded-md ${
          nextPage ? "hover:bg-slate-100" : "opacity-50 cursor-not-allowed"
        }`}
        aria-disabled={!nextPage}
        tabIndex={!nextPage ? -1 : undefined}
        onClick={(e) => !nextPage && e.preventDefault()}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    </div>
  )
}
