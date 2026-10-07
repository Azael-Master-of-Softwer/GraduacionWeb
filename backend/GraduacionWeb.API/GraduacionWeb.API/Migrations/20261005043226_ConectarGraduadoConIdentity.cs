using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GraduacionWeb.API.Migrations
{
    /// <inheritdoc />
    public partial class ConectarGraduadoConIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Graduados_Usuarios_UsuarioId",
                table: "Graduados");

            migrationBuilder.DropIndex(
                name: "IX_Graduados_UsuarioId",
                table: "Graduados");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Graduados");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Graduados",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Graduados_ApplicationUserId",
                table: "Graduados",
                column: "ApplicationUserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Graduados_AspNetUsers_ApplicationUserId",
                table: "Graduados",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Graduados_AspNetUsers_ApplicationUserId",
                table: "Graduados");

            migrationBuilder.DropIndex(
                name: "IX_Graduados_ApplicationUserId",
                table: "Graduados");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Graduados");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Graduados",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Graduados_UsuarioId",
                table: "Graduados",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Graduados_Usuarios_UsuarioId",
                table: "Graduados",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
