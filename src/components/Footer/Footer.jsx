"use client";

import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter
} from "react-icons/bs";
import img from "../../assets/GettyImages-138596308-ad71719.webp";
import Image from "next/image";

function FooterComp() {
  return (
    <Footer container className="bg-blue-200 mt-8 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-8">
        {/* Logo */}
        <div className="flex items-center justify-center sm:col-span-1 md:col-span-1">
          <Image
            src={img}
            className="object-cover rounded-full w-16 h-16 md:w-20 md:h-20"
            alt=""
            width={1000}
            height={1000}
          />
        </div>
        {/* Footer Links */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 sm:col-span-2 md:col-span-2">
          {/* About */}
          <div>
            <Footer.Title title="about" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Flowbite</Footer.Link>
              <Footer.Link href="#">Tailwind CSS</Footer.Link>
            </Footer.LinkGroup>
          </div>
          {/* Follow Us */}
          <div>
            <Footer.Title title="Follow us" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Github</Footer.Link>
              <Footer.Link href="#">Discord</Footer.Link>
            </Footer.LinkGroup>
          </div>
          {/* Legal */}
          <div>
            <Footer.Title title="Legal" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Privacy Policy</Footer.Link>
              <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
      </div>
      {/* Divider */}
      <Footer.Divider />
      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-center mt-4 md:flex-row md:items-center md:justify-between">
        {/* Copyright */}
        <Footer.Copyright href="#" by="Flowbite™" year={2022} />
        {/* Social Icons */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Footer.Icon href="#" icon={BsFacebook} />
          <Footer.Icon href="#" icon={BsInstagram} />
          <Footer.Icon href="#" icon={BsTwitter} />
          <Footer.Icon href="#" icon={BsGithub} />
          <Footer.Icon href="#" icon={BsDribbble} />
        </div>
      </div>
    </Footer>
  );
}

export default FooterComp;
