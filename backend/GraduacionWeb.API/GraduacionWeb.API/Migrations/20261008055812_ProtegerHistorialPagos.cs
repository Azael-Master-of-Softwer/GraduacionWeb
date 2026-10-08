using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GraduacionWeb.API.Migrations
{
    /// <inheritdoc />
    public partial class ProtegerHistorialPagos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Graduados_AspNetUsers_ApplicationUserId",
                table: "Graduados");

            migrationBuilder.DropForeignKey(
                name: "FK_Pagos_Graduados_GraduadoId",
                table: "Pagos");

            migrationBuilder.AddForeignKey(
                name: "FK_Graduados_AspNetUsers_ApplicationUserId",
                table: "Graduados",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Pagos_Graduados_GraduadoId",
                table: "Pagos",
                column: "GraduadoId",
                principalTable: "Graduados",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Graduados_AspNetUsers_ApplicationUserId",
                table: "Graduados");

            migrationBuilder.DropForeignKey(
                name: "FK_Pagos_Graduados_GraduadoId",
                table: "Pagos");

            migrationBuilder.AddForeignKey(
                name: "FK_Graduados_AspNetUsers_ApplicationUserId",
                table: "Graduados",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pagos_Graduados_GraduadoId",
                table: "Pagos",
                column: "GraduadoId",
                principalTable: "Graduados",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
