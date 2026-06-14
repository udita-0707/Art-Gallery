import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to generate a mock 1536-dimensional vector for pgvector
function generateMockEmbedding() {
  const embedding = Array(1536).fill(0).map(() => (Math.random() * 2 - 1));
  // Normalize vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  const normalized = embedding.map(val => val / magnitude);
  return `[${normalized.join(',')}]`;
}

async function main() {
  console.log('🧹 Cleaning up database tables...');

  // Delete all rows from tables in reverse order of dependency
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.adminAction.deleteMany({});
  
  // To avoid foreign key issues, let's clear artworks, profiles, users
  await prisma.artwork.deleteMany({});
  await prisma.artistProfile.deleteMany({});
  await prisma.user.deleteMany({});
  
  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.exhibition.deleteMany({});

  console.log('✅ Database cleaned successfully.');

  // ── 1. Create Categories ───────────────────────────────────────────────────
  console.log('🌱 Seeding Categories...');
  const categoryNames = ['Painting', 'Sculpture', 'Photography', 'Digital', 'Mixed Media', 'Drawing'];
  const categories: Record<string, any> = {};
  
  for (const name of categoryNames) {
    const cat = await prisma.category.create({ data: { name } });
    categories[name.toLowerCase()] = cat;
  }
  console.log(`✅ Seeded ${categoryNames.length} categories.`);

  // ── 2. Create Tags ─────────────────────────────────────────────────────────
  console.log('🌱 Seeding Tags...');
  const tagNames = [
    'Abstract', 'Minimalist', 'Vibrant', 'Surreal', 'Geometric', 
    'Nature', 'Urban', 'Classical', 'Generative', 'Textured', 
    'Monochromatic', 'Landscape', 'Portrait', 'Kinetic', 'Organic'
  ];
  const tags: Record<string, any> = {};
  
  for (const name of tagNames) {
    const t = await prisma.tag.create({ data: { name } });
    tags[name.toLowerCase()] = t;
  }
  console.log(`✅ Seeded ${tagNames.length} tags.`);

  // ── 3. Create Users & Artist Profiles ─────────────────────────────────────
  console.log('🌱 Seeding Users & Artist Profiles...');

  // 3a. Admin User
  const adminUser = await prisma.user.create({
    data: {
      id: 'usr_admin_1',
      email: 'admin@spectrum.art',
      role: 'ADMIN',
    }
  });

  // 3b. 10 Artist Users + Profiles
  const artistsData = [
    {
      id: 'usr_artist_1',
      email: 'yuki.tanaka@spectrum.art',
      bio: 'Generative artist exploring Japanese minimalism, complex recursive algorithms, and multi-spectral digital patterns.',
      isVerified: true
    },
    {
      id: 'usr_artist_2',
      email: 'elena.rostova@spectrum.art',
      bio: 'Impressionist landscape painter focusing on atmospheric light refraction, morning mist, and watercolor-oil emulsions.',
      isVerified: true
    },
    {
      id: 'usr_artist_3',
      email: 'marcus.vance@spectrum.art',
      bio: 'Metal and marble sculptor crafting monumental geometric abstracts that interact with urban architectural spaces.',
      isVerified: true
    },
    {
      id: 'usr_artist_4',
      email: 'chloe.dubois@spectrum.art',
      bio: 'Architectural and street photographer capturing light, shadow, and stark human moments in urban concrete jungles.',
      isVerified: true
    },
    {
      id: 'usr_artist_5',
      email: 'rajesh.patel@spectrum.art',
      bio: 'Mixed media and collage artist exploring post-colonial identities, textile layers, and industrial discarded materials.',
      isVerified: false
    },
    {
      id: 'usr_artist_6',
      email: 'aria.bennett@spectrum.art',
      bio: 'Botanical illustrator bringing dark surrealism to traditional watercolor portraits and organic ink washes.',
      isVerified: true
    },
    {
      id: 'usr_artist_7',
      email: 'zack.snyder@spectrum.art',
      bio: '3D sculptor and VR installation designer exploring surreal non-Euclidean spaces and synthetic anatomy.',
      isVerified: true
    },
    {
      id: 'usr_artist_8',
      email: 'sophia.loren@spectrum.art',
      bio: 'Ceramics artist building organic, fluid clay forms inspired by deep-sea coral reefs and marine biology.',
      isVerified: false
    },
    {
      id: 'usr_artist_9',
      email: 'kofi.mensah@spectrum.art',
      bio: 'Vibrant abstract expressionist using heavy palette knives, thick acrylic overlays, and gold leaf elements.',
      isVerified: true
    },
    {
      id: 'usr_artist_10',
      email: 'li.wei@spectrum.art',
      bio: 'Reinterpreting classical East Asian calligraphy and ink wash paintings with modern geometric abstractions.',
      isVerified: true
    }
  ];

  const artistProfiles: any[] = [];
  for (const art of artistsData) {
    const user = await prisma.user.create({
      data: {
        id: art.id,
        email: art.email,
        role: 'ARTIST',
      }
    });

    const profile = await prisma.artistProfile.create({
      data: {
        userId: user.id,
        bio: art.bio,
        isVerified: art.isVerified,
      }
    });
    artistProfiles.push(profile);
  }

  // 3c. 20 Customer Users
  const customers: any[] = [];
  for (let i = 1; i <= 20; i++) {
    const cust = await prisma.user.create({
      data: {
        id: `usr_customer_${i}`,
        email: `customer.${i}@spectrum.art`,
        role: 'CUSTOMER',
      }
    });
    customers.push(cust);
  }

  console.log('✅ Seeded 1 Admin, 10 Artists, and 20 Customers.');

  // ── 4. Create 50 Artworks ──────────────────────────────────────────────────
  console.log('🌱 Seeding 50 Artworks...');
  
  // Pool of high quality curated art assets from Unsplash
  const unsplashArtUrls = [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=800&q=80',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80',
    'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/Stonehenge%2C_2007_07_30.jpg',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Golden_Gate_Bridge%2C_SF_%28cropped%29.jpg',
    'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&q=80',
    'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/5/5c/Mont_Saint-Michel_and_Saint_Jude.jpg',
    'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=800&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&q=80',
    'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80',
    'https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/4/45/Aurora_Borealis_2.jpg',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
    'https://images.unsplash.com/photo-1577083288073-40892c0860a4?w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/6/66/Monet%2C_Claudine_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/34/Hubble_Deep_Field_1b.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/1e/Starry_Night_Over_the_Rhone.jpg',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80',
    'https://upload.wikimedia.org/wikipedia/commons/5/5f/The_Scream.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/Stonehenge%2C_2007_07_30.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Golden_Gate_Bridge%2C_SF_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/5c/Mont_Saint-Michel_and_Saint_Jude.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/4/45/Aurora_Borealis_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/66/Monet%2C_Claudine_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/34/Hubble_Deep_Field_1b.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/1e/Starry_Night_Over_the_Rhone.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/5f/The_Scream.jpg',
  ];

  // Specific mediums for realism
  const mediums = [
    'Oil on canvas', 'Bronze sculpture', 'Digital render', 'Gelatin silver print',
    'Acrylic & ink', 'Watercolor & graphite', 'Mixed media collage', 'Earthenware clay',
    'Gouache on paper', '3D generative mesh'
  ];

  const artworkTitles = [
    'Staccato Silence', 'Chroma Drift', 'Vectored Balance', 'Sublimation', 'Interstellar Garden',
    'Nocturnal Tide', 'Luminescent Form', 'Monolith VIII', 'Recursive Dream', 'Fractured Echo',
    'Temporal Wave', 'Geometric Horizon', 'Ethereal Forest', 'Urban Compression', 'Resonance',
    'Symphony in Grey', 'Golden Convergence', 'Silent Threshold', 'Liquid Architecture', 'Botanical Noir',
    'Memory Layer', 'Tectonic Synthesis', 'Aeon', 'Quantum Flow', 'Silt & Stone',
    'Heliocentric', 'Dissonance', 'Subterranean Rise', 'Astral Fabric', 'Prismatic Shift',
    'Aperture', 'Organic Singularity', 'Fossilized Light', 'Atmospheric Drift', 'Synapse',
    'Static Harmony', 'Spectral Void', 'Gravity Well', 'Velvet Shadow', 'Origin Point',
    'Meridian', 'Echo Chamber', 'Nadir', 'Solar Wind', 'Thermal Trace',
    'Kinetic Balance', 'Grid Collapse', 'Refracted Dawn', 'Rust & Silk', 'Endless Scroll'
  ];

  const artworks: any[] = [];

  for (let i = 0; i < 50; i++) {
    // Distribute equally across our 10 artists
    const artistIndex = i % 10;
    const artist = artistProfiles[artistIndex];

    // Determine category based on artist index
    let categoryName = 'Painting';
    if (artistIndex === 0 || artistIndex === 6) categoryName = 'Digital';
    else if (artistIndex === 2 || artistIndex === 7) categoryName = 'Sculpture';
    else if (artistIndex === 3) categoryName = 'Photography';
    else if (artistIndex === 4) categoryName = 'Mixed Media';
    else if (artistIndex === 5 || artistIndex === 9) categoryName = 'Drawing';

    const category = categories[categoryName.toLowerCase()];

    // Generate price between $500 and $18,000
    const price = Math.round((Math.random() * 175 + 5) * 100);
    // Year between 2020 and 2026
    const year = 2020 + (i % 7);

    // Pick 2 random tag objects for implicit connection
    const tag1 = tags['abstract'];
    const tag2 = tags[Object.keys(tags)[i % Object.keys(tags).length]];

    const artwork = await prisma.artwork.create({
      data: {
        id: `art_seed_${i + 1}`,
        artistId: artist.id,
        title: artworkTitles[i],
        description: `An exquisite work of ${mediums[i % mediums.length].toLowerCase()} that challenges the spatial perceptions of the observer, rendering elements of ${tag2.name.toLowerCase()} in a compelling display.`,
        price,
        imageUrl: unsplashArtUrls[i % unsplashArtUrls.length],
        categoryId: category.id,
        isModerated: i % 10 !== 0, // 90% moderated (approved), 10% pending review
        aiTags: [tag1.name, tag2.name, 'curated', 'fine-art'],
        tags: {
          connect: [
            { id: tag1.id },
            { id: tag2.id }
          ]
        }
      }
    });

    // Populate pgvector embeddings raw update
    const mockVector = generateMockEmbedding();
    await prisma.$executeRaw`
      UPDATE "Artwork" 
      SET embedding = ${mockVector}::vector 
      WHERE id = ${artwork.id}
    `;

    artworks.push(artwork);
  }

  console.log(`✅ Seeded 50 artworks with pgvector embeddings.`);

  // ── 5. Create 5 Exhibitions ────────────────────────────────────────────────
  console.log('🌱 Seeding 5 Exhibitions...');

  const exhibitionsData = [
    {
      id: 'exh_seed_1',
      title: 'Digital Synaesthetics',
      description: 'An immersive exhibition exploring generative neural art, non-Euclidean digital projections, and algorithms mapping organic systems.',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-06-30'),
      location: 'Virtual Pavillion & WebVR',
      status: 'ACTIVE',
      featured: true,
      curator: 'Dr. Sarah Williams',
      artworkIds: ['art_seed_1', 'art_seed_7', 'art_seed_11', 'art_seed_17'],
    },
    {
      id: 'exh_seed_2',
      title: 'Sublimated Shadows',
      description: 'A study in monochromatic photography, capturing structural alignments and urban landscapes under harsh sunlight.',
      startDate: new Date('2026-05-15'),
      endDate: new Date('2026-07-15'),
      location: 'South wing, Floor 3',
      status: 'ACTIVE',
      featured: false,
      curator: 'Elena Rostova',
      artworkIds: ['art_seed_4', 'art_seed_14', 'art_seed_24'],
    },
    {
      id: 'exh_seed_3',
      title: 'Monumental Balance',
      description: 'Outdoor exhibition featuring heavy steel assemblages, marble suspensions, and clay formations interacting with public space.',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-31'),
      location: 'Sculpture Garden, North Patio',
      status: 'UPCOMING',
      featured: true,
      curator: 'Marcus Vance',
      artworkIds: ['art_seed_3', 'art_seed_8', 'art_seed_13', 'art_seed_18'],
    },
    {
      id: 'exh_seed_4',
      title: 'Atmospheric Refractions',
      description: 'Impressionist paintings exploring maritime mornings, coastal mists, and the limits of water-based pigments.',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-11-15'),
      location: 'Main Gallery, East Hall',
      status: 'UPCOMING',
      featured: false,
      curator: 'Aria Bennett',
      artworkIds: ['art_seed_2', 'art_seed_12', 'art_seed_22'],
    },
    {
      id: 'exh_seed_5',
      title: 'Colonial Fragments',
      description: 'Historical artifacts and raw industrial materials collaged to interrogate socio-cultural spaces.',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-04-30'),
      location: 'Central Gallery, Vault Room',
      status: 'COMPLETED',
      featured: false,
      curator: 'Rajesh Patel',
      artworkIds: ['art_seed_5', 'art_seed_15', 'art_seed_25', 'art_seed_35'],
    },
  ];

  for (const exh of exhibitionsData) {
    await prisma.exhibition.create({ data: exh });
  }

  console.log(`✅ Seeded 5 exhibitions.`);

  // ── 6. Create Wishlists / Favorites ───────────────────────────────────────
  console.log('🌱 Seeding Favorites (Wishlist profiles)...');

  // Let's populate favorites for a few customer profiles so we can verify the My Collections page
  const favoriteMappings = [
    { userId: 'usr_customer_1', artworks: ['art_seed_1', 'art_seed_4', 'art_seed_10'] },
    { userId: 'usr_customer_2', artworks: ['art_seed_2', 'art_seed_3', 'art_seed_8', 'art_seed_9'] },
    { userId: 'usr_customer_3', artworks: ['art_seed_5', 'art_seed_15', 'art_seed_25'] },
  ];

  for (const fav of favoriteMappings) {
    await prisma.wishlist.create({
      data: {
        userId: fav.userId,
        artworkIds: fav.artworks,
      }
    });
  }

  console.log('✅ Seeded wishlist collections.');
  console.log('🎉 Database seeding and setup fully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
