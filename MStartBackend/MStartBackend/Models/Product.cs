namespace MStartBackend.Models
{
    public class Product
    {
        public int ID { get; set; }
        public DateTime ServerDateTime { get; set; }
        public DateTime DateTimeUTC { get; set; }
        public DateTime UpdateDateTimeUTC { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public decimal Amount { get; set; }
        public string? Currency { get; set; }

        public ICollection<Order>? Orders { get; set; }
    }
}
