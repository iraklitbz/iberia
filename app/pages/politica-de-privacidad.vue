<template>
  <div class="container mx-auto max-w-3xl px-4 py-20 lg:px-6">
    <h1 class="text-3xl font-bold text-zinc-800">{{ $t('privacypolicy') }}</h1>
    <div class="prose prose-zinc mt-10 max-w-none">
      <p>En cumplimiento con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos (LOPD), la Asociación Cultural y Educativo Español IBERIA informa sobre su política de privacidad.</p>
      <h2>Responsable del tratamiento</h2>
      <p>Asociación Cultural y Educativo Español IBERIA<br/>Email: asociacioniberia@gmail.com</p>
      <h2>Finalidad del tratamiento</h2>
      <p>Los datos personales que nos facilite a través del formulario de contacto serán utilizados exclusivamente para responder a su consulta y mantener comunicación con usted.</p>
      <h2>Legitimación</h2>
      <p>La base legal para el tratamiento de sus datos es el consentimiento que nos otorga al enviarnos el formulario de contacto.</p>
      <h2>Destinatarios</h2>
      <p>Sus datos no serán cedidos a terceros salvo obligación legal.</p>
      <h2>Derechos</h2>
      <p>Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición enviando un email a asociacioniberia@gmail.com.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', headerSolid: true })
const { t } = useI18n()
useSeoMeta({ title: `${t('privacypolicy')} — Iberia` })
</script>
