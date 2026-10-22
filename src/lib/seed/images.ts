/**
 * Seed imagery (Unsplash). Placeholders until the owner uploads real
 * screenshots and photos from the admin. Dimensions are the originals'.
 */
import type { ImageAsset } from '@/types'

const unsplash = (id: string, width: number, height: number, alt: string): ImageAsset => ({
  src: `https://images.unsplash.com/photo-${id}`,
  width,
  height,
  alt,
  credit: 'Unsplash',
})

export const img = {
  portrait: unsplash('1531384441138-2736e62e0919', 4000, 6000, 'Portrait of Emmanuel Olowu'),
  portraitAlt: unsplash('1522529599102-193c0d76b5b6', 5472, 3648, 'Emmanuel smiling outdoors'),
  teamTable: unsplash('1519389950473-47ba0277781c', 6000, 4000, 'A product team working around a shared table'),
  deskSetup: unsplash('1499951360447-b19be8fe80f5', 5848, 3899, 'A bright desk with a laptop and monitor'),
  dashboardDark: unsplash('1551288049-bebda4e38f71', 4810, 3207, 'Analytics dashboard with revenue charts'),
  dashboardLaptop: unsplash('1460925895917-afdab827c52f', 2426, 1728, 'Laptop showing a reporting dashboard'),
  dashboardTiles: unsplash('1526628953301-3e589a6a8b74', 2947, 2121, 'Dashboard tiles with key metrics'),
  chartPaper: unsplash('1543286386-713bdd548da4', 5472, 3648, 'A hand-drawn growth chart on paper'),
  serverRack: unsplash('1558494949-ef010cbdcc31', 3956, 2220, 'Server rack with network cabling'),
  patchPanel: unsplash('1544197150-b99a580bb7a8', 6000, 4000, 'Patch panel with blue network cables'),
  laptopPhone: unsplash('1563986768609-322da13575f3', 6720, 4480, 'Testing a web app on a laptop and a phone'),
  checkout: unsplash('1556742049-0cfed4f6a45d', 3000, 2002, 'A customer paying at a shop counter'),
  financeApp: unsplash('1551650975-87deedd944c3', 4843, 3632, 'Hand holding a phone with a finance app'),
  aiChip: unsplash('1677442136019-21780ecad995', 5120, 2880, 'Abstract render of an AI processor'),
  circuit: unsplash('1550751827-4bd374c3f58b', 7360, 4912, 'Illuminated circuit pattern'),
  pythonCode: unsplash('1515879218367-8466d910aaa4', 6016, 4016, 'Python code on a monitor'),
  codeClose: unsplash('1461749280684-dccba630e2f6', 3543, 2365, 'Close-up of source code'),
  typing: unsplash('1486312338219-ce68d2c6f44d', 4076, 2712, 'Hands typing on a laptop'),
  blueprint: unsplash('1600132806370-bf17e65e942f', 3865, 2257, 'Wireframe sketches of a web interface'),
  wireframing: unsplash('1587440871875-191322ee64b0', 4229, 2819, 'A team sketching wireframes with sticky notes'),
} satisfies Record<string, ImageAsset>
