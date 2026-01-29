'use client';

/**
 * 品牌切换 Tab 组件
 */

interface BrandTabsProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

export default function BrandTabs({ brands, selectedBrand, onBrandChange }: BrandTabsProps) {
  return (
    <div className="border-b border-gray-700">
      <nav className="flex overflow-x-auto">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => onBrandChange(brand)}
            className={`
              px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors
              ${
                selectedBrand === brand
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }
            `}
          >
            {brand}
          </button>
        ))}
      </nav>
    </div>
  );
}
