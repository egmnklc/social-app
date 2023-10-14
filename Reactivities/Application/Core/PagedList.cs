// Will be used for anything, any type of list in the application.
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            // In case list has 12 items and a page size of 10, this will be 2
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            // Return the range of items, otherwise we return 0 items.
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            // When we implement paging, we're going to be performing two queries to our database.
            // First one is the count of the items before pagination has taken place.
            var count = await source.CountAsync();
            /* Idea of this: Say we have a list of 12 items and a page size of 10.
            *   To get the first 10 records, we need to get the page number - 1, which will be 0 * pageSize.
            *   For the second page, it will be pageNumber - 1 * pageSize which is 10, and will return the next 10 records.
            * By chaining ToListAsync, we defer the execution. We build up our query, which is an expression tree that we
            * pass to list method, and only then we execute the database commands to go and do something and get the data back
            * or count the amount of items in a list.
            * 
            * Here, say we are on the second page, we skip the first 10 entries, on the third page we skip 30 entries and so on.
            * This is the logic for our pagination.
            */
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}