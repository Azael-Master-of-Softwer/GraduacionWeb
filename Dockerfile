FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY backend/GraduacionWeb.API/GraduacionWeb.API/ ./GraduacionWeb.API/
RUN dotnet publish GraduacionWeb.API/GraduacionWeb.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://0.0.0.0:${PORT:-10000} dotnet GraduacionWeb.API.dll"]