namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;
        
        public int PageNumber { get; set; } = 1;

        // Default activities per page is set to 10
        private int _pageSize = 2;
        public int PageSize
        {
            get => _pageSize;
            // If client exceeds max page size, it will be auto set to max page size
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        
    }
}