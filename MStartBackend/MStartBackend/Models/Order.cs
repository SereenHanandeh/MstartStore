namespace MStartBackend.Models
{
    public class Order
    {
        public int ID { get; set; }

        // العلاقات
        public int CustomerID { get; set; }
        public Customer? Customer { get; set; }

        public int ProductID { get; set; }
        public Product? Product { get; set; }

        public DateTime ServerDateTime { get; set; }
        public DateTime DateTimeUTC { get; set; }

        public decimal TotalAmount { get; set; }
        public string? Currency { get; set; }
    }
}
