import headerImage from '@/assets/image-assets/PM-Holiday-Image1.jpg'
export default function ChristmasTemplate() {

  return (
    <div className="w-full max-w-200 mx-auto">
      <div className="title rounded-xl border w-full h-[430px] bg-cover bg-center bg-no-repeat flex items-center justify-center px-10" style={{ backgroundImage: `url(${headerImage})` }}>
        <div className="bg-[#fffc] w-full rounded-xl h-[140px] flex items-center justify-center">
          <h1 className="font-bold text-[50px] text-[#BF0F35]">happy holidays!</h1>
        </div>
      </div>

      <div className="text">
        <h2 className="text-[24px] text-center text-gray-600 py-5 px-32">Enjoy the holidays with your family and friends with these festive recipes and gift ideas!</h2>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-end">
          <img src="src/assets/image-assets/PM-Holiday-Image2.jpg" alt="" />
          <div className='bg-[#BF0F35] p-5'>
            <h3 className="text-center font-bold text-lg text-white">sweet berry pie</h3>
            <p className="text-center text-white">the sweetest and easiest berry pie perfect for the Holidays!</p>
          </div>
           <button className="border-4 rounded-xl border-red-700 px-1 py-3 my-3">Read More</button>
        </div>
        <div className="flex flex-col items-center justify-end">
          <img src="src/assets/image-assets/PM-Holiday-Image3.jpg" alt="" />
          <div className='bg-[#BF0F35] p-5'>
            <h3 className="text-center text-lg text-white font-bold">10 meaningful gifts</h3>
            <p className="text-center text-white">worry no more with these gifts that your family will love!</p>
          </div>
          <button className="border-4 rounded-xl border-red-700 px-1 py-3 my-3">Read More</button>
        </div>
      </div>

      <div className="bg-[#BF0F35] p-5">
        <h3 className="text-center text-lg font-bold text-white">Follow us social media</h3>
        <div className='flex justify-center items-center gap-5 p-2'>
          <img className='w-[35px]' src="src/assets/image-assets/facebook.png" alt="" />
          <img className='w-[35px]' src="src/assets/image-assets/ig.png" alt="" />
          <img className='w-[35px]' src="src/assets/image-assets/pinterest.png" alt="" />
          <img className='w-[35px]' src="src/assets/image-assets/twitter.png" alt="" />
        </div>
      </div>

      <div className="footer p-5">
        <p className="text-[16px] text-[#4a4a4a] text-center">Copyright 2019 Yoursite. All right reserved</p>
        <p className="text-[16px] text-[#4a4a4a] text-center pb-4">You subscribed to our newsletter via our website,</p>
        <a href='#' className="block underline text-[16px] text-[#4a4a4a] text-center">Unsubscribe from this list</a>
      </div>
    </div>
  )
}
