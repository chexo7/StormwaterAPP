import React from 'react';
import {
  Map as MapIconBase,
  Upload as UploadIconBase,
  XCircle as XCircleIconBase,
  Info as InfoIconBase,
  Trash2 as TrashIconBase,
  Edit as EditIconBase,
  Lock as LockClosedIconBase,
  Eye as EyeIconBase,
  EyeOff as EyeOffIconBase,
  CheckCircle as CheckCircleIconBase,
  Search as SearchIconBase,
} from 'lucide-react';

type IconProps = { className?: string };
export const MapIcon: React.FC<IconProps> = ({ className }) => <MapIconBase className={className} />;
export const UploadIcon: React.FC<IconProps> = ({ className }) => <UploadIconBase className={className} />;
export const XCircleIcon: React.FC<IconProps> = ({ className }) => <XCircleIconBase className={className} />;
export const InfoIcon: React.FC<IconProps> = ({ className }) => <InfoIconBase className={className} />;
export const TrashIcon: React.FC<IconProps> = ({ className }) => <TrashIconBase className={className} />;
export const EditIcon: React.FC<IconProps> = ({ className }) => <EditIconBase className={className} />;
export const LockClosedIcon: React.FC<IconProps> = ({ className }) => <LockClosedIconBase className={className} />;
export const EyeIcon: React.FC<IconProps> = ({ className }) => <EyeIconBase className={className} />;
export const EyeOffIcon: React.FC<IconProps> = ({ className }) => <EyeOffIconBase className={className} />;
export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => <CheckCircleIconBase className={className} />;
export const SearchIcon: React.FC<IconProps> = ({ className }) => <SearchIconBase className={className} />;

