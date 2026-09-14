const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
       <rect width="400" height="300" fill="#eee"/>
       <text x="200" y="155" text-anchor="middle" font-family="system-ui, sans-serif"
             font-size="18" fill="#888">image unavailable</text>
     </svg>`
  );


export type ProductSlug =
  | 'monstera-deliciosa'
  | 'snake-plant'
  | 'pothos-golden'
  | 'peace-lily'
  | 'spider-plant'
  | 'fiddle-leaf-fig'
  | 'boston-fern'
  | 'jade-plant'
  | 'succulents-trio'
  | 'calathea-orbifolia'
  | 'african-violet'
  | 'heartleaf-philodendron'
  | 'zz-plant'
  | 'aloe-vera'
  | 'bird-of-paradise'
  | 'chinese-money-plant'
  | 'rubber-plant'
  | 'string-of-pearls'
  | 'pruning-shears'
  | 'copper-watering-can'
  | 'plant-mister-bottle'
  | 'terracotta-pots-set'
  | 'speckled-ceramic-pot'
  | 'woven-hanging-planter'
  | 'premium-potting-mix'
  | 'succulent-cactus-mix'
  | 'orchid-bark-mix'
  | 'slow-release-fertilizer';

export type CategorySlug =
  | 'low-light'
  | 'air-purifying'
  | 'succulents'
  | 'flowering'
  | 'trailing'
  | 'pet-friendly';

export const PRODUCT_IMAGES: Record<ProductSlug, string> = {
  'monstera-deliciosa':       'https://images.pexels.com/photos/7318283/pexels-photo-7318283.jpeg',
  'snake-plant':              'https://images.pexels.com/photos/29218657/pexels-photo-29218657.jpeg',
  'pothos-golden':            'https://images.pexels.com/photos/29118327/pexels-photo-29118327.jpeg',
  'peace-lily':               'https://images.pexels.com/photos/32425125/pexels-photo-32425125.jpeg',
  'spider-plant':             'https://images.pexels.com/photos/31757820/pexels-photo-31757820.jpeg',
  'fiddle-leaf-fig':          'https://images.pexels.com/photos/7084309/pexels-photo-7084309.jpeg',
  'boston-fern':              'https://images.pexels.com/photos/3854749/pexels-photo-3854749.jpeg',
  'jade-plant':               'https://images.pexels.com/photos/36177544/pexels-photo-36177544.jpeg',
  'succulents-trio':          'https://images.pexels.com/photos/7354795/pexels-photo-7354795.jpeg',
  'calathea-orbifolia':       'https://images.pexels.com/photos/33448610/pexels-photo-33448610.jpeg',
  'african-violet':           'https://images.pexels.com/photos/7814294/pexels-photo-7814294.jpeg',
  'heartleaf-philodendron':   'https://image.pexels.com/photos/17665056/pexels-photo-17665056.jpeg',
  'zz-plant':                 'https://images.pexels.com/photos/5188783/pexels-photo-5188783.jpeg',
  'aloe-vera':                'https://images.pexels.com/photos/8445035/pexels-photo-8445035.jpeg',
  'bird-of-paradise':         'https://images.pexels.com/photos/2478230/pexels-photo-2478230.jpeg',
  'chinese-money-plant':      'https://images.pexels.com/photos/7180559/pexels-photo-7180559.jpeg',
  'rubber-plant':             'https://images.pexels.com/photos/4094002/pexels-photo-4094002.jpeg',
  'string-of-pearls':         'https://images.pexels.com/photos/12367419/pexels-photo-12367419.jpeg',
  'pruning-shears':           'https://images.pexels.com/photos/6662500/pexels-photo-6662500.jpeg',
  'copper-watering-can':      'https://images.pexels.com/photos/8989429/pexels-photo-8989429.jpeg',
  'plant-mister-bottle':      'https://images.pexels.com/photos/7149725/pexels-photo-7149725.jpeg',
  'terracotta-pots-set':      'https://images.pexels.com/photos/8851519/pexels-photo-8851519.jpeg',
  'speckled-ceramic-pot':     'https://images.pexels.com/photos/7290359/pexels-photo-7290359.jpeg',
  'woven-hanging-planter':    'https://images.pexels.com/photos/6471700/pexels-photo-6471700.jpeg',
  'premium-potting-mix':      'https://images.pexels.com/photos/6913399/pexels-photo-6913399.jpeg',
  'succulent-cactus-mix':     'https://images.pexels.com/photos/4507702/pexels-photo-4507702.jpeg',
  'orchid-bark-mix':          'https://images.pexels.com/photos/4058160/pexels-photo-4058160.jpeg',
  'slow-release-fertilizer':  'https://images.pexels.com/photos/31673795/pexels-photo-31673795.jpeg',
};

export const CATEGORY_IMAGES: Record<CategorySlug, string> = {
  'low-light':      'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=800',
  'air-purifying':  'https://images.pexels.com/photos/793012/pexels-photo-793012.jpeg?auto=compress&cs=tinysrgb&w=800',
  'succulents':     'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=800',
  'flowering':      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=800',
  'trailing':       'https://images.pexels.com/photos/1446093/pexels-photo-1446093.jpeg?auto=compress&cs=tinysrgb&w=800',
  'pet-friendly':   'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=800',
};

export function resolveProductImage(slug: string | undefined | null): string {
  if (!slug) return PLACEHOLDER;
  return (PRODUCT_IMAGES as Record<string, string>)[slug] ?? PLACEHOLDER;
}

export function resolveCategoryImage(slug: string | undefined | null): string {
  if (!slug) return PLACEHOLDER;
  return (CATEGORY_IMAGES as Record<string, string>)[slug] ?? PLACEHOLDER;
}
