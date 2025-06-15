
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileSection = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <div className="flex-shrink-0">
        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-warmBrown/20">
          <AvatarImage src="/avatar.png" alt="Profile" />
          <AvatarFallback className="bg-warmBrown/10 text-warmBrown text-lg sm:text-xl font-bold">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-warmBrown mb-1">
          Lorenz Linhardt
        </h1>
        <p className="text-base sm:text-lg text-warmBrown/70 mb-1">
          Research Assistant
        </p>
        <p className="text-sm sm:text-base text-warmBrown/60">
          Technische Universität Berlin • Machine Learning Group
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
