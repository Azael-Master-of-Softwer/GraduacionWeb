using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GraduacionWeb.API.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Graduado> Graduados { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Pago> Pagos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relación ApplicationUser → Graduado
            modelBuilder.Entity<Graduado>()
                .HasOne(g => g.ApplicationUser)
                .WithOne()
                .HasForeignKey<Graduado>(g => g.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación Graduado → Pagos
            modelBuilder.Entity<Pago>()
                .HasOne(p => p.Graduado)
                .WithMany()
                .HasForeignKey(p => p.GraduadoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Fecha del pago
            modelBuilder.Entity<Pago>()
                .Property(p => p.Fecha)
                .HasColumnType("timestamp without time zone");
        }
    }
}