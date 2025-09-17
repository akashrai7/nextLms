"use client";

import React, { useState } from "react";
import Image from "next/image";
import Nav from "@/components/LMS/video/Nav";
import Link from "next/link";

interface Account {
  id: string;
  name: string;
  description?: string;
  icon: string;
  isConnected: boolean;
}

const initialConnectedAccounts: Account[] = [
  {
    id: "google",
    name: "Google",
    description: "Calendar and Contacts",
    icon: "/images/socials/google.svg",
    isConnected: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Communications",
    icon: "/images/socials/slack.svg",
    isConnected: true,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Manage your Git repositories",
    icon: "/images/socials/github.svg",
    isConnected: true,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing service",
    icon: "/images/socials/mailchimp.svg",
    isConnected: true,
  },
  {
    id: "figma",
    name: "Figma",
    description: "Design",
    icon: "/images/socials/figma.svg",
    isConnected: true,
  },
];

const initialSocialAccounts: Account[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: "/images/socials/facebook.svg",
    isConnected: true,
  },
  {
    id: "twitter",
    name: "X",
    icon: "/images/socials/twitter.svg",
    isConnected: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/images/socials/instagram.svg",
    isConnected: false, // Not Connected
  },
  {
    id: "dribbble",
    name: "Dribbble",
    icon: "/images/socials/dribbble.svg",
    isConnected: true,
  },
  {
    id: "behance",
    name: "Behance",
    icon: "/images/socials/behance.svg",
    isConnected: true,
  },
];

const ConnectionsContent: React.FC = () => {
  const [connectedAccounts, setConnectedAccounts] = useState(
    initialConnectedAccounts
  );
  const [socialAccounts, setSocialAccounts] = useState(initialSocialAccounts);

  const handleDisconnect = (id: string) => {
    setConnectedAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, isConnected: false } : account
      )
    );
    setSocialAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, isConnected: false } : account
      )
    );
  };

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Video Link</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Settings
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Video Link
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <Nav />

           <h5 className="!mb-[22px]">Connected Accounts</h5>
                <ul>
                  {connectedAccounts.map((account) => (
                    <li
                      key={account.id}
                      className="flex items-center justify-between mb-[20px] last:mb-0"
                    >
                      <div className="flex items-center gap-[15px]">
                        <Image
                          src={account.icon}
                          width={40}
                          height={40}
                          alt={account.name}
                        />
                        <div>
                          <span className="block text-black dark:text-white font-semibold">
                            {account.name}
                          </span>
                          <span className="block mt-[3px]">{account.description}</span>
                        </div>
                      </div>
          
                      {account.isConnected ? (
                        <button
                          type="button"
                          onClick={() => handleDisconnect(account.id)}
                          className="inline-block transition-all text-primary-500 hover:underline"
                        >
                          Click to Disconnect
                        </button>
                      ) : (
                        <span className="text-gray-500">Disconnected</span>
                      )}
                    </li>
                  ))}
                </ul>
          
                <div className="border-t border-gray-100 dark:border-[#172036] my-[20px] md:my-[25px]"></div>
          
                <h5 className="!mb-[22px]">Social Accounts</h5>
                <ul>
                  {socialAccounts.map((account) => (
                    <li
                      key={account.id}
                      className="flex items-center justify-between mb-[20px] last:mb-0"
                    >
                      <div className="flex items-center gap-[15px]">
                        <Image
                          src={account.icon}
                          width={40}
                          height={40}
                          alt={account.name}
                        />
                        <span className="block text-black dark:text-white font-semibold">
                          {account.name}
                        </span>
                      </div>
          
                      {account.isConnected ? (
                        <button
                          type="button"
                          onClick={() => handleDisconnect(account.id)}
                          className="inline-block transition-all text-primary-500 hover:underline"
                        >
                          Click to Disconnect
                        </button>
                      ) : (
                        <span className="text-gray-500">Not Connected</span>
                      )}
                    </li>
                  ))}
                </ul>
        </div>
      </div>
    </>
  );
}
