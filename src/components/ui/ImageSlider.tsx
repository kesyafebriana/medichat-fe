import { Flex } from "@chakra-ui/react";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface item {
  img: StaticImageData;
  desc: string;
}

interface itemData {
  items: item[];
}

function ImageSlider({ items }: itemData): React.ReactElement {
  return (
    <div className="swiffy-slider">
      <ul className="slider-container slider-indicators-sm">
        {items.map((item) => (
          <li key={item.desc} className="flex items-center justify-center">
            <Image src={item.img} alt={item.desc} className="object-cover" height={350} width={900}/>
          </li>
        ))}
      </ul>

      <button type="button" className="slider-nav"></button>
      <button type="button" className="slider-nav slider-nav-next"></button>

      <div className="invisible lg:visible slider-indicators">
        {items.map((item, idx) => (
          <button key={item.desc} className={idx === 0 ? `active` : ``}></button>
        ))}
      </div>
      <div className="lg:hidden slider-indicators slider-indicators-sm">
        {items.map((item, idx) => (
          <button key={item.desc} className={idx === 0 ? `active` : ``}></button>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;
