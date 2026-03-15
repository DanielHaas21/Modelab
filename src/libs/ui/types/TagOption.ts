/**
 * Represents a tag option that can be selected in a tag selection component.
 */
export interface TagOption {
  name: string;
  id: number; // Unique
  isSelected?: boolean;
}
