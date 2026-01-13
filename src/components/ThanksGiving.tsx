import { useTranslation } from 'react-i18next'
export default function ThankGiving() {
  const { t, i18n } = useTranslation()
  return (
    <div className="bg-[#F8F9FA] rounded-xl w-150 mx-auto">
      <div className='flex justify-between items-center'>
        <img src="src/assets/image-giving/food-logo.jpg" alt="" />
        <div className='p-5'>
          <button className='bg-[#FF700C] hover:bg-[#FF9D57] hover:text-[#4a4a4a] text-white w-20 px-2 py-1 font-bold text-[16px]' onClick={() => i18n.changeLanguage('en')} title={t('translate_to_en')}>English</button>
          <button className='bg-[#FF9D57] hover:bg-[#FF700C] hover:text-[#4a4a4a] text-white w-20 px-2 py-1 font-bold text-[16px]' onClick={() => i18n.changeLanguage('zh')} title={t('translate_to_zh')}>中 文</button>
        </div>
      </div>
      <h1 className='text-center font-bold text-[48px] text-amber-500'>{t('Thanks Giving')}</h1>
      <img src="src/assets/image-giving/img-10.jpg" alt="" />
      <h1 className="text-[36px] text-[#4A4A4A] text-center font-bold p-5">{t('Garlic Herb Roast Turkey')}</h1>
      <p className="text-center text-[#4A4A4A]">{t('turkey_description')}</p>
      <button className="block my-5 mx-auto text-white font-bold text-[16px] rounded-xl px-2 py-3 bg-[#FF700C]">{t('View Recipe')}</button>
      <div className="border-2 border-[#FF9D57] my-5"></div>
      <h2 className="my-6 text-center text-[#4A4A4A] font-bold text-[24px]"></h2>
      <div className="grid grid-cols-2 gap-4 my-5">
        <div className="flex flex-col items-center">
          <img className="rounded-lg" src="src/assets/image-giving/img-11.jpg" alt="" />
          <h2 className="text-[#4a4a4a] font-bold text-center text-lg my-5">{t('Harvest Pumpkin Soup')}</h2>
          <button className="bg-[#ff700c] text-white font-bold text-[16px] rounded-xl py-3 px-2">{t('View Recipe')}</button>
        </div>
        <div className="flex flex-col items-center">
          <img className="rounded-lg" src="src/assets/image-giving/img-12.jpg" alt="" />
          <h2 className="text-[#4a4a4a] font-bold text-center text-lg my-5">{t('Sweet Vanilla Cupcakes')}</h2>
          <button className="bg-[#ff700c] text-white font-bold text-[16px] rounded-xl py-3 px-2">{t('View Recipe')}</button>
        </div>
      </div>
      <div className="bg-[#ff9d57] flex flex-col items-center justify-center h-40">
        <h2 className="font-bold text-center text-white text-[16px]">{t('Follow us')}</h2>
        <div className="flex item-center justify-center gap-4">
          <img className='w-[35px]' src="src/assets/image-assets/facebook.png" alt="" />
          <img className='w-[35px]' src="src/assets/image-assets/ig.png" alt="" />
          <img className='w-[35px]' src="src/assets/image-assets/pinterest.png" alt="" />
          <img className='w-[35px]' src="src/assets/image-assets/twitter.png" alt="" />
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 my-5 text-[#4a4a4a] text-[14px]">
        <a href="#">{t('Privacy Policy')}</a>
        <a href="#">{t('Terms Of Use')}</a>
        <a href="#">{t('Contact Us')}</a>
        <a href="#">{t('Unsubscribe')}</a>
      </div>
    </div>
  )
}
