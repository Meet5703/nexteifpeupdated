/* eslint-disable no-unused-vars */
import React from "react";
import Image from "next/image"; // Import next/image component
import EagleAboutimg from "../../assets/EagleAbut.webp";
const About = () => {
  return (
    <div className="bg-blue-200 mt-4 md:mt-6 w-full py-8">
      <h1 className="w-full text-center font-bold text-4xl md:text-6xl">
        About Us
      </h1>
      <div className="mx-8 md:flex">
        {/* Replace img tag with Image component */}
        <div className="md:w-1/2 relative h-96">
          <Image
            src={EagleAboutimg}
            layout="fill" // Set layout to fill to make the image responsive
            objectFit="cover" // Maintain aspect ratio and cover the container
            alt="Eagle Image"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="w-full text-center font-bold text-4xl">EIFPE</h1>
          <p className="text-justify md:text-xl md:px-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio
            corporis velit soluta recusandae ea quam, odio autem necessitatibus
            illo temporibus deserunt quis facilis provident sint et. Reiciendis
            animi amet non placeat quidem nam ad molestias suscipit nihil
            dolorum officiis labore nisi odit fugit ullam adipisci obcaecati
            corrupti, vitae, illo aspernatur inventore magnam. Veritatis
            possimus provident laboriosam cupiditate, earum, omnis aspernatur
            unde soluta et debitis doloribus veniam neque. Placeat asperiores
            debitis sequi ducimus itaque, dolore perspiciatis! Veniam placeat
            quasi est. Iusto dignissimos dolor fugiat error! Nam vel incidunt
            placeat? Facere excepturi rem quasi recusandae perferendis
            blanditiis. Dolorum ullam illo ab necessitatibus!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
