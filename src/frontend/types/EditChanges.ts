import { CategoryOption, FileOption, TagOption } from '../../libs/ui/components';

export interface EditChanges {
  name: string;
  description: string;
  category: CategoryOption;
  tags: TagOption[];
  files: FileOption[];
}
