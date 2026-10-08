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

        public DbSet<Pago> Pagos { get; set; }

        public DbSet<EventoCalendario> EventosCalendario { get; set; }

        public DbSet<Aviso> Avisos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relación ApplicationUser → Graduado
            modelBuilder.Entity<Graduado>()
                .HasOne(g => g.ApplicationUser)
                .WithOne()
                .HasForeignKey<Graduado>(g => g.ApplicationUserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Relación Graduado → Pagos
            modelBuilder.Entity<Pago>()
                .HasOne(p => p.Graduado)
                .WithMany()
                .HasForeignKey(p => p.GraduadoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Restricciones de Graduado
            modelBuilder.Entity<Graduado>(e =>
            {
                e.HasIndex(g => g.CodigoRegistro).IsUnique();
                e.HasIndex(g => g.Identificador).IsUnique();
                e.Property(g => g.Identificador).HasMaxLength(50);
                e.Property(g => g.CodigoRegistro).HasMaxLength(8);
                e.Property(g => g.TotalGraduacion).HasPrecision(18, 2);
            });

            // Restricciones de Pago
            modelBuilder.Entity<Pago>(e =>
            {
                e.Property(p => p.Monto).HasPrecision(18, 2);
                e.Property(p => p.Concepto).HasMaxLength(200);
                e.Property(p => p.Estado).HasMaxLength(20);
            });
        }
    }
}