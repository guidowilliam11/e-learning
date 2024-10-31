import Image from 'next/image';

export default function CourseCard({ logoSrc, title, description, progress, maxProgress }) {
    return (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            {/* Course Logo */}
            <div className="h-52 bg-gray-100 flex items-center justify-center">
                <Image src={logoSrc} alt={`${title} logo`} width={80} height={80} />
            </div>

            {/* Course Info */}
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500">{description}</p>

                <div className="border-t border-gray-200 my-3"></div>


                {/* Progress */}
                <div className="mt-4">
                    <div className='flex justify-between'>
                        <span className="text-sm text-gray-600">Progress:</span>
                        <span className="text-xs text-gray-600">
                            {progress}/{maxProgress}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                            className="bg-orange-400 h-2.5 rounded-full"
                            style={{ width: `${(progress / maxProgress) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
