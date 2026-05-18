"use client";

import { FormEvent, useState } from "react";

const WHATSAPP_NUMBER = "50700000000";

const shirtTypes = ["T-Shirt Regular", "Oversized Tee", "Hoodie"];
const printTypes = ["Rhinestones", "Screen Print", "DTF Print", "Embroidery"];
const sizes = ["S", "M", "L", "XL"];
const colors = ["Blanco", "Negro"];

export function CustomOrderClient() {
  const [shirtType, setShirtType] = useState(shirtTypes[0]);
  const [printType, setPrintType] = useState(printTypes[0]);
  const [size, setSize] = useState("S");
  const [color, setColor] = useState("Blanco");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const message = `
Hola Rystar, quiero cotizar una pieza personalizada.

Tipo de prenda: ${shirtType}
Color: ${color}
Talla: ${size}
Tipo de diseño: ${printType}

Descripción:
${String(formData.get("description") ?? "")}

Instagram / Teléfono:
${String(formData.get("contact") ?? "")}
`.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <section className="bg-black px-5 py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-700">
            Make your piece
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight text-white md:text-8xl">
            Configure your order
          </h1>

          <p className="mt-8 max-w-xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Personaliza tu pieza Rystar. Selecciona prenda, color, talla, tipo
            de diseño y envía tu idea para cotizar por WhatsApp.
          </p>

          <div className="mt-10 border border-white/10 bg-white/[0.03] p-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f2eb]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.08))]" />

              <div className="absolute left-1/2 top-[18%] h-[42%] w-[34%] -translate-x-[78%] rounded-t-[45%] bg-white shadow-2xl" />
              <div className="absolute left-1/2 top-[18%] h-[42%] w-[34%] -translate-x-[-8%] rounded-t-[45%] bg-white shadow-2xl" />

              <div className="absolute bottom-5 left-5 border border-white/20 bg-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em]">
                Live Preview
              </div>

              <div className="absolute bottom-5 right-5 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-500">
                Rystar Studios
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
              Prenda / Color
            </label>

            <select
              value={shirtType}
              onChange={(event) => setShirtType(event.target.value)}
              className="w-full border border-white/15 bg-black px-5 py-5 text-sm font-black uppercase tracking-[0.16em] text-white outline-none"
            >
              {shirtTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
              Color
            </label>

            <div className="grid grid-cols-2 gap-3">
              {colors.map((item) => {
                const active = item === color;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setColor(item)}
                    className={[
                      "border px-5 py-4 text-xs font-black uppercase tracking-[0.2em] transition",
                      active
                        ? "border-white bg-white text-black"
                        : "border-white/15 text-white hover:border-white",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
              Talla
            </label>

            <div className="grid grid-cols-4 gap-3">
              {sizes.map((item) => {
                const active = item === size;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    className={[
                      "border px-5 py-4 text-sm font-black uppercase tracking-[0.18em] transition",
                      active
                        ? "border-white bg-white text-black"
                        : "border-white/15 text-white hover:border-white",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
              Tipo de diseño
            </label>

            <select
              value={printType}
              onChange={(event) => setPrintType(event.target.value)}
              className="w-full border border-white/15 bg-black px-5 py-5 text-sm font-black uppercase tracking-[0.16em] text-white outline-none"
            >
              {printTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
              Tu diseño PNG
            </label>

            <div className="flex min-h-40 items-center justify-center border border-dashed border-white/20 bg-white/[0.03] px-6 py-10 text-center text-xs font-black uppercase leading-6 tracking-[0.2em] text-neutral-500">
              Sube tu arte y muévelo encima de la prenda
              <br />
              Próximamente con editor visual
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
              Descripción del diseño
            </label>

            <textarea
              name="description"
              required
              rows={5}
              placeholder="Describe posición, tamaño, estilo, referencias, color del arte o cualquier detalle importante."
              className="w-full resize-none border border-white/15 bg-white/[0.03] px-5 py-5 text-sm leading-6 text-white outline-none placeholder:text-neutral-700"
            />
          </div>

          <div>
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
              Instagram o teléfono
            </label>

            <input
              name="contact"
              required
              placeholder="@tuusuario o +507 6000-0000"
              className="w-full border border-white/15 bg-white/[0.03] px-5 py-5 text-sm text-white outline-none placeholder:text-neutral-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white px-8 py-6 text-sm font-black uppercase tracking-[0.28em] text-black transition hover:bg-neutral-200"
          >
            Enviar pedido por WhatsApp →
          </button>

          <p className="border-t border-white/10 pt-6 text-xs font-black uppercase leading-6 tracking-[0.22em] text-neutral-700">
            Rystar Studios · Custom Program · All pieces made to order
          </p>
        </form>
      </div>
    </section>
  );
}