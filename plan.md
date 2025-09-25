# Refactoring Plan: Extract Reusable Components

## ✅ Completed Components

### 1. Common UI Components (components/ui/)

#### ✅ LoadingSpinner
- **Status**: COMPLETED
- **Location**: `/components/ui/LoadingSpinner.tsx`
- **Usage**: Used in Home.tsx and events.tsx for loading states
- **Props**: `size?: 'small' | 'large'`, `color?: string`, `text?: string`

#### ✅ Button
- **Status**: COMPLETED
- **Location**: `/components/ui/Button.tsx`
- **Usage**: Used in Home.tsx, events.tsx, relationships.tsx
- **Variants**: primary, secondary, danger, success, ghost
- **Props**: `variant`, `onPress`, `text`, `disabled?`, `style?`, `textStyle?`, `fullWidth?`

#### ✅ Card
- **Status**: COMPLETED
- **Location**: `/components/ui/Card.tsx`
- **Usage**: Base component for cards (ready for use in Home dashboard modules)
- **Props**: `children`, `style?`, `onPress?`, `borderLeftColor?`

#### ✅ Modal
- **Status**: COMPLETED
- **Location**: `/components/ui/Modal.tsx`
- **Usage**: Standardized modal wrapper (ready for use in events/relationships)
- **Props**: `visible`, `onClose`, `title?`, `children`, `animationType?`, `contentStyle?`, `showCloseButton?`, `scrollable?`

#### ✅ SectionHeader
- **Status**: COMPLETED
- **Location**: `/components/ui/SectionHeader.tsx`
- **Usage**: Used in events.tsx and relationships.tsx
- **Props**: `title`, `rightElement?`, `style?`, `textStyle?`

#### ✅ EmptyState
- **Status**: COMPLETED
- **Location**: `/components/ui/EmptyState.tsx`
- **Usage**: Used in events.tsx and relationships.tsx for empty data states
- **Props**: `message`, `icon?`, `iconColor?`

### 2. Feature-Specific Components (components/)

#### ✅ EventCard
- **Status**: COMPLETED
- **Location**: `/components/events/EventCard.tsx`
- **Usage**: Used in events.tsx for all event list items
- **Props**: `event: Event`, `onPress: (event: Event) => void`, `showCategory?: boolean`, `style?: ViewStyle`

### NotificationItem (components/notifications/)
```tsx
// Extract from Home.tsx (lines 178-204)
interface NotificationItemProps {
  icon: string;
  iconColor: string;
  text: string;
  time: string;
}
```

### DashboardModule (components/dashboard/)
```tsx
// Generic dashboard module from Home.tsx
interface DashboardModuleProps {
  title: string;
  icon: string;
  borderColor: string;
  onPress: () => void;
  children: React.ReactNode;
  actionText: string;
}
```

### GroupCard (components/groups/)
```tsx
// Extract from relationships.tsx (lines 372-392, 405-416)
interface GroupCardProps {
  group: Group;
  isOwner?: boolean;
  isMember?: boolean;
  onPress: (group: Group) => void;
}
```

### RoleSelector (components/form/)
```tsx
// Extract dropdown selector from relationships/events modals
interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  options: string[];
}
```

### DatePicker (components/form/)
```tsx
// Extract calendar/date picker from events.tsx (lines 616-656)
interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  minDate?: string;
}
```

## 3. Higher-Order Components & Hooks

### useAuth (hooks/)
```tsx
// Extract authentication logic from Home.tsx (lines 21-39)
const useAuth = () => {
  // Returns: { user, loading, error, signOut }
}
```

### useModal (hooks/)
```tsx
// Extract modal state management
const useModal = (initialState = false) => {
  // Returns: { visible, open, close, toggle }
}
```

## 4. Shared Styles (styles/)

### common.ts
- Container styles
- Text styles
- Spacing utilities

### modals.ts
- Modal overlay
- Modal content
- Modal buttons

### buttons.ts
- Button variants
- Button states
- Button sizes

### cards.ts
- Card containers
- Card shadows
- Card spacing

## 5. Mock Data (data/)

### mockEvents.ts
- Move events database from events.tsx
- Export typed event arrays

### mockRelationships.ts
- Move relationships database from relationships.tsx
- Export typed relationship data

## Directory Structure
```
PFMobileAppV3/
├── components/
│   ├── ui/
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoadingSpinner.test.tsx
│   │   ├── Card.tsx
│   │   ├── Card.test.tsx
│   │   ├── Modal.tsx
│   │   ├── Modal.test.tsx
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── SectionHeader.test.tsx
│   │   ├── EmptyState.tsx
│   │   └── EmptyState.test.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   └── EventCard.test.tsx
│   ├── notifications/
│   │   ├── NotificationItem.tsx
│   │   └── NotificationItem.test.tsx
│   ├── dashboard/
│   │   ├── DashboardModule.tsx
│   │   ├── DashboardModule.test.tsx
│   │   ├── TimeLogModule.tsx
│   │   ├── EventsModule.tsx
│   │   └── NotificationsModule.tsx
│   ├── groups/
│   │   ├── GroupCard.tsx
│   │   └── GroupCard.test.tsx
│   └── form/
│       ├── RoleSelector.tsx
│       ├── RoleSelector.test.tsx
│       ├── DatePicker.tsx
│       ├── DatePicker.test.tsx
│       ├── TextInput.tsx
│       └── TextInput.test.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useAuth.test.ts
│   ├── useModal.ts
│   └── useModal.test.ts
├── styles/
│   ├── common.ts
│   ├── modals.ts
│   ├── buttons.ts
│   └── cards.ts
├── data/
│   ├── mockEvents.ts
│   └── mockRelationships.ts
└── app/
    └── (tabs)/
        ├── Home.tsx (refactored)
        ├── events.tsx (refactored)
        └── relationships.tsx (refactored)
```

## Benefits

1. **Testability**: Each component can be tested in isolation with focused unit tests
2. **Reusability**: Components can be shared across multiple pages, reducing code duplication
3. **Maintainability**: Changes in one component automatically apply everywhere it's used
4. **Type Safety**: Full TypeScript interfaces for all component props
5. **Performance**: Components can be optimized with React.memo where appropriate
6. **Developer Experience**: Clear component API and documentation
7. **Code Organization**: Logical separation of concerns

## Implementation Order

### Phase 1: Core UI Components (High Impact)
1. LoadingSpinner
2. Button
3. Modal
4. Card

### Phase 2: Form Components
1. TextInput
2. RoleSelector
3. DatePicker

### Phase 3: Feature Components
1. EventCard
2. GroupCard
3. NotificationItem
4. DashboardModule

### Phase 4: Hooks & Utilities
1. useAuth
2. useModal
3. Extract mock data

### Phase 5: Style Consolidation
1. Create shared style modules
2. Update components to use shared styles

## Testing Strategy

Each component will have:
- Unit tests for component rendering
- Props validation tests
- Event handler tests
- Accessibility tests where applicable
- Snapshot tests for UI consistency

Example test structure:
```tsx
// LoadingSpinner.test.tsx
describe('LoadingSpinner', () => {
  it('renders with default props');
  it('renders with custom size');
  it('renders with custom color');
  it('displays loading text when provided');
});
```

## Migration Notes

- Start with components that have no dependencies
- Update imports gradually as components are extracted
- Maintain backward compatibility during migration
- Document component APIs with JSDoc comments
- Consider creating a Storybook for component documentation