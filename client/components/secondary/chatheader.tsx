import React from 'react'
import Image from "next/image"

interface Props {
  receiverImage: string,
  receiver: string
}

export const ChatHeader = ({ receiver, receiverImage }: Props) => {
  return (
    <div className="flex items-center">
      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
        <Image
          fill
          priority
          quality={99}
          src={receiverImage || "/p.jpg"}
          alt="Profile picture"
          className="object-cover"
        />
      </div>
      <div className="ml-3">
        <h2 className="text-xl text-white font-semibold">{receiver ? receiver : "Loading.."}</h2>
        {/* <div className={`flex items-center text-xs ${isOnline ? "text-green-500" : "text-neutral-400"}`}> */}
        {/* <span
            className={`h-1.5 w-1.5 rounded-full mr-1 ${isOnline ? "bg-green-500" : "bg-neutral-400"}`}
          ></span>
          {isOnline ? "Online" : "Offline"} */}
        {/* </div> */}
      </div>
    </div>
  )
}