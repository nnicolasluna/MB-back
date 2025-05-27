-- AddForeignKey
ALTER TABLE "public"."monitoreo_agua" ADD CONSTRAINT "monitoreo_agua_aud_usuario_crea_fkey" FOREIGN KEY ("aud_usuario_crea") REFERENCES "public"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
