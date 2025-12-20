import type { WorkCategory, WorkPortfolio } from "../types";

export const portfolioWorks: WorkPortfolio[] = [
  {
    id: 1,
    slug: "xoai-ca-phe",
    category: "branding",
    thumbnail:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
    featured: true,

    client: {
      id: "xoai-ca-phe",
      name: "Xoài Cà Phê",
      industry: "Coffee / F&B",
      logo: "https://dummyimage.com/200x200/ccc/000&text=Xoai+Cafe",
    },

    overview:
      "Xoài Cà Phê là quán cà phê sân vườn rộng rãi tại Tây Ninh, phục vụ nhóm gia đình, bạn bè và khách du lịch. Mục tiêu là xây dựng hình ảnh mộc mạc, gần gũi thiên nhiên và dễ tiếp cận với nhiều nhóm tuổi.",

    scope: [
      "Định vị hình ảnh thương hiệu",
      "Xây dựng mood & tone",
      "Thiết kế nội dung mạng xã hội",
      "Chụp ảnh không gian và sản phẩm",
    ],

    servicesUsed: ["branding", "production", "smm"],

    results: [
      "Hình ảnh thương hiệu đồng nhất trên Facebook",
      "Tăng lượng check-in cuối tuần",
      "Khách hàng nhận diện rõ phong cách sân vườn – gia đình",
    ],

    mediaSections: [
      {
        title: "Không gian & sản phẩm",
        items: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200",
            caption: "Không gian sân vườn thoáng mát",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200",
            caption: "Đồ uống phong cách mộc mạc",
          },
        ],
      },
    ],

    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=61559926349446",
      },
    ],
  },

  {
    id: 2,
    slug: "hop-cafe",
    category: "smm",
    thumbnail:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200",
    featured: true,

    client: {
      id: "hop-cafe",
      name: "Hộp Café",
      industry: "Coffee / F&B",
      logo: "https://dummyimage.com/200x200/ccc/000&text=Hop+Cafe",
    },

    overview:
      "Hộp Café là quán cà phê hiện đại, trẻ trung, sở hữu mascot riêng và tập trung mạnh vào TikTok để tiếp cận nhóm khách hàng Gen Z.",

    scope: [
      "Xây dựng content TikTok",
      "Định hình cá tính thương hiệu",
      "Kịch bản video ngắn",
      "Quản lý kênh social",
    ],

    servicesUsed: ["smm", "production"],

    results: [
      "Nội dung TikTok bắt trend",
      "Tăng lượt follow tự nhiên",
      "Mascot được nhận diện rộng rãi",
    ],

    mediaSections: [
      {
        title: "TikTok Content",
        items: [
          {
            type: "video",
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            caption: "Video mascot bắt trend",
          },
        ],
      },
    ],

    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/lammothop",
      },
      {
        platform: "tiktok",
        url: "https://www.tiktok.com/@hopcafe",
      },
    ],
  },

  {
    id: 3,
    slug: "company-coffee",
    category: "branding",
    thumbnail:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",

    client: {
      id: "company-coffee",
      name: "Company Coffee",
      industry: "Coffee Chain",
    },

    overview:
      "Company Coffee là chuỗi coffee shop có hình ảnh chỉn chu, tập trung mạnh vào mùa lễ hội, decor và trải nghiệm check-in cho dân văn phòng.",

    scope: [
      "Thiết kế hình ảnh truyền thông",
      "Concept decor theo mùa",
      "Content mạng xã hội",
    ],

    servicesUsed: ["branding", "production", "smm"],

    results: [
      "Tăng lượng check-in",
      "Hình ảnh sang trọng – tinh tế",
      "Phù hợp khách văn phòng",
    ],

    mediaSections: [
      {
        title: "Decor & Campaign",
        items: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200",
          },
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200",
          },
          {
            type: "video",
            url: "https://www.youtube.com/embed/hporCspYd0c?si=uain59UZMPsysnCW",
          },
        ],
      },
      {
        title: "Video about company",
        items: [
          {
            type: "video",
            url: "https://www.youtube.com/embed/WacNtrXcXBE?si=fwS7ufdsTrZAWpGq",
          },
          {
            type: "video",
            url: "https://www.youtube.com/embed/WacNtrXcXBE?si=fwS7ufdsTrZAWpGq",
          },
        ],
      },
    ],

    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=100064267174348",
      },
    ],
  },

  {
    id: 4,
    slug: "pho-ta-hien",
    category: "smm",
    thumbnail:
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200",

    client: {
      id: "pho-ta-hien",
      name: "Phố Tạ Hiện",
      industry: "Beer / F&B",
    },

    overview:
      "Phố Tạ Hiện mang phong cách bia hơi Hà Nội chính gốc tại Tây Ninh, hướng tới không khí sôi động, đường phố và anh em bằng hữu.",

    scope: [
      "Xây dựng hình ảnh đường phố",
      "Content fanpage",
      "Chụp ảnh không khí quán",
    ],

    servicesUsed: ["smm", "production"],

    results: [
      "Fanpage tương tác cao",
      "Thu hút nhóm khách nam",
      "Không khí quán rõ cá tính",
    ],

    mediaSections: [
      {
        title: "Không khí quán",
        items: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
          },
        ],
      },
    ],

    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/photahientayninh",
      },
    ],
  },

  {
    id: 5,
    slug: "gio-ca-phe",
    category: "branding",
    thumbnail:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200",

    client: {
      id: "gio-ca-phe",
      name: "Gió Cà Phê",
      industry: "Coffee / Chill",
    },

    overview:
      "Gió Cà Phê mang phong cách chill, hiện đại, không gian thoáng đãng với view núi, phù hợp giới trẻ và khách du lịch.",

    scope: [
      "Định hình phong cách hình ảnh",
      "Chụp ảnh lifestyle",
      "Content truyền cảm xúc",
    ],

    servicesUsed: ["branding", "production"],

    results: ["Hình ảnh chill – cảm xúc", "Thu hút khách du lịch"],

    mediaSections: [
      {
        title: "View & Lifestyle",
        items: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
          },
        ],
      },
    ],

    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=61584087260362",
      },
    ],
  },

  {
    id: 6,
    slug: "san-nha",
    category: "branding",
    thumbnail:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200",

    client: {
      id: "san-nha",
      name: "Sân Nhà",
      industry: "Garden Cafe",
    },

    overview:
      "Sân Nhà là quán sân vườn mộc mạc, thân thiện, phù hợp gia đình, người lớn tuổi và các buổi brunch nhẹ nhàng.",

    scope: [
      "Xây dựng hình ảnh mộc mạc",
      "Content gia đình – brunch",
      "Chụp ảnh không gian",
    ],

    servicesUsed: ["branding", "production", "smm"],

    results: [
      "Hình ảnh gần gũi",
      "Thu hút nhóm gia đình",
      "Tăng lượng khách buổi sáng",
    ],

    mediaSections: [
      {
        title: "Không gian sân vườn",
        items: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200",
          },
        ],
      },
    ],

    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/sannhabychucchuc",
      },
    ],
  },
];

export const getWorkById = (id: number): WorkPortfolio | undefined => {
  return portfolioWorks.find((work: WorkPortfolio) => work.id === id);
};

export const getWorkByCategory = (cate: WorkCategory): WorkPortfolio[] => {
  if (cate === "all") return portfolioWorks;
  return portfolioWorks.filter((w) => w.category === cate);
};

export const getWorkByFeatured = (): WorkPortfolio[] => {
  return portfolioWorks.filter((w) => w.featured);
};

export const getWorkBySlug = (slug: string): WorkPortfolio | undefined => {
  return portfolioWorks.find((work: WorkPortfolio) => work.slug === slug);
};
