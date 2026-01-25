# Statik içerik sunumu için hafif nginx imajını kullan
FROM nginx:alpine

# Çalışma dizinini ayarla
WORKDIR /usr/share/nginx/html

# Varsayılan nginx statik varlıklarını temizle
RUN rm -rf ./*

# Proje dosyalarını kopyala
COPY . .

# Nginx yapılandırmasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80'i dışa aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
