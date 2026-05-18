"use client";

import { FormEvent } from "react";

const WHATSAPP_NUMBER = "50769115944";

export function ContactFormClient() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const comment = String(formData.get("comment") ?? "");

    const message = `
Hola Rystar, tengo una consulta.

Nombre: ${name}
Correo: ${email}
Teléfono: ${phone}

Comentario:
${comment}
`.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 bg-white/[0.03] p-5 md:p-8"
    >
      <div className="grid gap-5">
        <input
          required
          name="name"
          placeholder="NOMBRE"
          className="w-full border border-white/15 bg-black px-5 py-5 text-xs font-black uppercase tracking-[0.25em] text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
        />

        <input
          required
          name="email"
          type="email"
          placeholder="CORREO ELECTRÓNICO *"
          className="w-full border border-white/15 bg-black px-5 py-5 text-xs font-black uppercase tracking-[0.25em] text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
        />

        <input
          name="phone"
          placeholder="NÚMERO DE TELÉFONO"
          className="w-full border border-white/15 bg-black px-5 py-5 text-xs font-black uppercase tracking-[0.25em] text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
        />

        <textarea
          required
          name="comment"
          placeholder="COMENTARIO"
          rows={8}
          className="w-full resize-none border border-white/15 bg-black px-5 py-5 text-xs font-black uppercase leading-6 tracking-[0.25em] text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
        />

        <button
          type="submit"
          className="bg-white px-8 py-6 text-xs font-black uppercase tracking-[0.3em] text-black transition hover:bg-neutral-200"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}