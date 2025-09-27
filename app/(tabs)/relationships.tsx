// Created by Noah Lee
// Things to do: adjust events page to include groups - send notification for which group? created for set of groups? join event as a group?

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from '../../assets/colors/colors';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';

// Define interfaces
interface Group {
  id: string;
  name: string;
  type: string;
  icon: string;
  description?: string;
  members?: number;
  owner?: string;
  isUserOwner?: boolean;
  category?: string;
}

interface UserRelationships {
  myGroups: Group[];
}

interface RelationshipsDatabase {
  [key: string]: UserRelationships;
}

// Global database of all public groups
const allPublicGroups: Group[] = [
  { 
    id: '1', 
    name: 'Carleton Mentors', 
    type: 'public', 
    icon: 'school',
    description: 'Official mentoring program from Carleton College connecting students with alumni.',
    members: 156,
    owner: 'Carleton College',
    category: 'Education'
  },
  { 
    id: '2', 
    name: 'Project Friendship Staff', 
    type: 'public', 
    icon: 'accessibility',
    description: 'Staff coordination group for Project Friendship community outreach program.',
    members: 42,
    owner: 'Project Friendship Organization',
    category: 'Community'
  },
  { 
    id: '3', 
    name: 'Tech Mentors Network', 
    type: 'public', 
    icon: 'laptop',
    description: 'Technology professionals mentoring aspiring developers and IT specialists.',
    members: 89,
    owner: 'Tech Industry Alliance',
    category: 'Technology'
  },
  { 
    id: '4', 
    name: 'Local Business Circle', 
    type: 'public', 
    icon: 'business',
    description: 'Network for local business owners to share resources and support one another.',
    members: 67,
    owner: 'Chamber of Commerce',
    category: 'Business'
  },
  { 
    id: '5', 
    name: 'Northfield Youth Sports', 
    type: 'public', 
    icon: 'sports-basketball',
    description: 'Coordination group for youth sports coaches and volunteers.',
    members: 115,
    owner: 'Northfield Recreation Department',
    category: 'Sports'
  }
];

// Mock database
const mockRelationships: RelationshipsDatabase = {
  'e1db9520-5081-70b8-b349-ea4464540888': {
    myGroups: [
      { 
        id: '101', 
        name: "Noah's Mentoring Group", 
        type: 'private', 
        icon: 'group',
        description: 'A private mentoring group led by Noah focused on career development.',
        members: 8,
        owner: 'Noah Lee', // should be like an ownerId - see if it matches
        isUserOwner: true
      },
      { 
        id: '1', // Same ID as in allPublicGroups
        name: 'Carleton Mentors', 
        type: 'public', 
        icon: 'school',
        description: 'Official mentoring program from Carleton College connecting students with alumni.',
        members: 156,
        owner: 'Carleton College',
        category: 'Education'
      }
    ]
  },
  'user2': {
    myGroups: [
      { 
        id: '201', 
        name: 'Family Circle', 
        type: 'private', 
        icon: 'group',
        description: 'Family mentoring and support group.',
        members: 5,
        owner: 'Jane Doe',
        isUserOwner: true
      },
      { 
        id: '3', // Same ID as in allPublicGroups 
        name: 'Tech Mentors Network', 
        type: 'public', 
        icon: 'laptop',
        description: 'Technology professionals mentoring aspiring developers and IT specialists.',
        members: 89,
        owner: 'Tech Industry Alliance',
        category: 'Technology'
      }
    ]
  }
};

// Relationship code generator - could use api in future
const generateRelationshipCode = (): string => {
  const code = Math.floor(100000000 + Math.random() * 900000000).toString();
  const matches = code.match(/.{1,3}/g);
  return matches ? matches.join(' ') : code;
};

// Generate unique ID
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const Relationships: React.FC = () => {
  const { userId } = useLocalSearchParams() as { userId?: string };
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [availablePublicGroups, setAvailablePublicGroups] = useState<Group[]>([]);
  const [joinModalVisible, setJoinModalVisible] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [inviteModalVisible, setInviteModalVisible] = useState<boolean>(false);
  const [groupInfoModalVisible, setGroupInfoModalVisible] = useState<boolean>(false);
  const [ownerModalVisible, setOwnerModalVisible] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('Mentor');
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [relationshipCode, setRelationshipCode] = useState<string>('');
  const [relationshipName, setRelationshipName] = useState<string>('');
  const [relationshipDescription, setRelationshipDescription] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<string>('private');
  const [generatedCode, setGeneratedCode] = useState<string>('');

  useEffect(() => {
    // Fetch user relationships from mock database
    const userID = userId || '';
    const defaultRelationships: UserRelationships = { myGroups: [] };
    
    // API CALL: In a real implementation, this would be an API call to fetch user relationships
    // GET /api/users/{userID}/relationships
    const userRelationships = mockRelationships[userID] || defaultRelationships;
    
    setMyGroups(userRelationships.myGroups);
    
    // Filter out public groups the user is already a member of
    const userGroupIds = userRelationships.myGroups.map(group => group.id);
    const filteredPublicGroups = allPublicGroups.filter(group => !userGroupIds.includes(group.id));
    setAvailablePublicGroups(filteredPublicGroups);
  }, [userId]);

  const handleJoinRelationship = (): void => {
    // API CALL: In a real implementation, this would be an API call to join a relationship
    // POST /api/relationships/join
    // Request body would include:
    // - relationshipCode: string
    // - role: string (the selected role)
    // - userId: string
    
    alert('Relationship joined successfully!');
    setJoinModalVisible(false);
    setRelationshipCode('');
    setSelectedRole('Mentor');
    
    // After successful API call, refresh the relationships list
    // This would trigger the useEffect to fetch updated relationships
  };

  const handleCreateRelationship = (): void => {
    // Validate inputs
    if (!relationshipName) {
      alert('Please enter a relationship name');
      return;
    }

    // Create new group
    const newGroup: Group = {
      id: generateUniqueId(),
      name: relationshipName,
      type: relationshipType,
      icon: relationshipType === 'private' ? 'group' : 'public',
      description: relationshipDescription || `A ${relationshipType} group for mentoring and support.`,
      members: 1,
      owner: 'Current User', // In a real app, use the actual user's name
      isUserOwner: true,
      category: 'General'
    };

    // Add to My Groups
    setMyGroups([...myGroups, newGroup]);
    
    // If it's public, add to the public groups database and remove from available
    if (relationshipType === 'public') {
      allPublicGroups.push(newGroup);
      // Remove from available public groups
      setAvailablePublicGroups(availablePublicGroups.filter(g => g.id !== newGroup.id));
    }
    
    // API CALL: In a real implementation, this would be an API call to create a relationship
    // POST /api/relationships
    // Request body would include new group data
    
    alert('Relationship created successfully!');
    setCreateModalVisible(false);
    setRelationshipName('');
    setRelationshipDescription('');
    setRelationshipType('private');
    setSelectedRole('Mentor');
  };

  const handleGroupPress = (group: Group): void => {
    setSelectedGroup(group);
    
    // If user is the owner, show the owner modal
    if (group.isUserOwner) {
      setOwnerModalVisible(true);
    } else {
      setGroupInfoModalVisible(true);
    }
  };

  const handleJoinGroup = (group: Group): void => {
    if (group.type === 'private') {
      alert('This is a private group. You need an invitation to join.');
      return;
    }

    // Check if user is already a member
    const isAlreadyMember = myGroups.some(g => g.id === group.id);
    
    if (isAlreadyMember) {
      alert('You are already a member of this group');
      return;
    }

    // API CALL: In a real implementation, this would be an API call to join a group
    // POST /api/groups/{group.id}/join
    
    // Add to My Groups
    setMyGroups([...myGroups, group]);
    
    // Remove from available public groups
    setAvailablePublicGroups(availablePublicGroups.filter(g => g.id !== group.id));
    
    alert(`You have successfully joined "${group.name}"`);
    setGroupInfoModalVisible(false);
  };

  const handleLeaveGroup = (group: Group): void => {
    // API CALL: In a real implementation, this would be an API call to leave a group
    // POST /api/groups/{group.id}/leave
    
    // Remove from My Groups
    const updatedMyGroups = myGroups.filter(g => g.id !== group.id);
    setMyGroups(updatedMyGroups);
    
    // If it's a public group, add it back to available public groups
    if (group.type === 'public') {
      // Find the original group in allPublicGroups
      const originalGroup = allPublicGroups.find(g => g.id === group.id);
      if (originalGroup) {
        setAvailablePublicGroups([...availablePublicGroups, originalGroup]);
      }
    }
    
    alert(`You have left "${group.name}"`);
    setGroupInfoModalVisible(false);
  };

  const handleDeleteGroup = (group: Group): void => {
    // API CALL: In a real implementation, this would be an API call to delete a group
    // DELETE /api/groups/{group.id}
    
    // Remove from My Groups
    const updatedMyGroups = myGroups.filter(g => g.id !== group.id);
    setMyGroups(updatedMyGroups);
    
    alert(`Group "${group.name}" has been deleted`);
    setOwnerModalVisible(false);
  };

  const renderRoleOption = (role: string): React.ReactElement => (
    <TouchableOpacity 
      style={styles.roleOption} 
      onPress={() => {
        setSelectedRole(role);
        setShowRoleDropdown(false);
      }}
    >
      <Text>{role}</Text>
    </TouchableOpacity>
  );

  const renderTypeOption = (type: string): React.ReactElement => (
    <TouchableOpacity 
      style={[
        styles.typeOption, 
        relationshipType === type ? styles.selectedTypeOption : {}
      ]} 
      onPress={() => setRelationshipType(type)}
    >
      <MaterialIcons 
        name={type === 'private' ? 'lock' : 'public'} 
        size={20} 
        color={relationshipType === type ? 'white' : '#333'} 
      />
      <Text style={relationshipType === type ? styles.selectedTypeText : styles.typeText}>
        {type === 'private' ? 'Private' : 'Public'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="people" size={24} color="white" />
        </View>
        <Text style={styles.headerText}>Relationships</Text>
      </View>

      <ScrollView>
        {/* My Groups Section */}
        <View style={styles.section}>
          <SectionHeader
            title="My Groups"
            style={styles.sectionHeaderStyle}
            textStyle={styles.sectionHeaderText}
          />
          {myGroups.length === 0 ? (
            <EmptyState
              message="You're not a member of any groups yet"
              icon="people-outline"
            />
          ) : (
            myGroups.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.groupItem}
                onPress={() => handleGroupPress(item)}
              >
                <MaterialIcons name={item.icon as any} size={24} style={styles.groupIcon} />
                <Text style={styles.groupName}>{item.name}</Text>
                {item.isUserOwner && (
                  <MaterialIcons name="star" size={16} color="gold" style={styles.ownerStar} />
                )}
                {item.type === 'public' && !item.isUserOwner && (
                  <View style={styles.groupTypeTag}>
                    <Text style={styles.groupTypeText}>Public</Text>
                  </View>
                )}
                {item.type === 'private' && !item.isUserOwner && (
                  <View style={[styles.groupTypeTag, styles.privateTag]}>
                    <Text style={styles.groupTypeText}>Private</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Public Groups Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Public Groups"
            style={styles.sectionHeaderStyle}
            textStyle={styles.sectionHeaderText}
          />
          {availablePublicGroups.length === 0 ? (
            <EmptyState
              message="No additional public groups available"
              icon="search-outline"
            />
          ) : (
            availablePublicGroups.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.groupItem}
                onPress={() => handleGroupPress(item)}
              >
                <MaterialIcons name={item.icon as any} size={24} style={styles.groupIcon} />
                <Text style={styles.groupName}>{item.name}</Text>
                {item.category && (
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          text="Join a group"
          onPress={() => setJoinModalVisible(true)}
          variant="secondary"
          style={styles.button}
        />

        <Button
          text="Create"
          onPress={() => setCreateModalVisible(true)}
          variant="secondary"
          style={styles.button}
        />
      </View>

      {/* Join Group Modal */}
      <Modal
        visible={joinModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join</Text>
            
            <View style={styles.scanQRContainer}>
              <Text style={styles.scanQRText}>Scan QR Code</Text>
            </View>
            
            <Text style={styles.inputLabel}>Relationship Code</Text>
            <TextInput 
              style={styles.textInput}
              value={relationshipCode}
              onChangeText={setRelationshipCode}
              placeholder="Enter code"
            />
            
            <Text style={styles.inputLabel}>Role</Text>
            <TouchableOpacity 
              style={styles.roleSelector}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <Text>{selectedRole}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} />
            </TouchableOpacity>
            
            {showRoleDropdown && (
              <View style={styles.roleDropdown}>
                {renderRoleOption('Parent')}
                {renderRoleOption('Mentor')}
                {renderRoleOption('Mentee')}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleJoinRelationship}
            >
              <Text style={styles.actionButtonText}>Start Relationship</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setJoinModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Modal */}
      <Modal
        visible={createModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Relationship</Text>
            
            <Text style={styles.inputLabel}>Relationship Name</Text>
            <TextInput 
              style={styles.textInput}
              value={relationshipName}
              onChangeText={setRelationshipName}
              placeholder="Enter name"
            />
            
            <Text style={styles.inputLabel}>Description (optional)</Text>
            <TextInput 
              style={[styles.textInput, styles.textArea]}
              value={relationshipDescription}
              onChangeText={setRelationshipDescription}
              placeholder="Enter a brief description"
              multiline={true}
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Type</Text>
            <View style={styles.typeSelector}>
              {renderTypeOption('private')}
              {renderTypeOption('public')}
            </View>
            
            <Text style={styles.inputLabel}>Your Role</Text>
            <TouchableOpacity 
              style={styles.roleSelector}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <Text>{selectedRole}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} />
            </TouchableOpacity>
            
            {showRoleDropdown && (
              <View style={styles.roleDropdown}>
                {renderRoleOption('Parent')}
                {renderRoleOption('Mentor')}
                {renderRoleOption('Mentee')}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCreateRelationship}
            >
              <Text style={styles.actionButtonText}>Create</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Invite Group Modal */}
      <Modal
        visible={inviteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite</Text>
            
            <View style={styles.qrCodeContainer}>
              {/* This would be an actual QR code component in real implementation */}
              <View style={styles.qrCode} />
            </View>
            
            <Text style={styles.codeLabel}>Relationship Code</Text>
            <Text style={styles.generatedCode}>{generatedCode}</Text>
            
            <Text style={styles.inputLabel}>Relationship Name</Text>
            <TextInput 
              style={styles.textInput}
              value={relationshipName}
              onChangeText={setRelationshipName}
              placeholder="Enter name"
            />
            
            <Text style={styles.inputLabel}>Role</Text>
            <TouchableOpacity 
              style={styles.roleSelector}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <Text>{selectedRole}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} />
            </TouchableOpacity>
            
            {showRoleDropdown && (
              <View style={styles.roleDropdown}>
                {renderRoleOption('Parent')}
                {renderRoleOption('Mentor')}
                {renderRoleOption('Mentee')}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setInviteModalVisible(false)}
            >
              <Text style={styles.actionButtonText}>Start Relationship</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setInviteModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Group Info Modal */}
      <Modal
        visible={groupInfoModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGroupInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGroup && (
              <>
                <View style={styles.modalHeader}>
                  <MaterialIcons 
                    name={selectedGroup.icon as any} 
                    size={36} 
                    color={colors.light_blue} 
                    style={styles.modalIcon} 
                  />
                  <Text style={styles.modalTitle}>{selectedGroup.name}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Type:</Text>
                  <Text style={styles.infoValue}>
                    {selectedGroup.type === 'public' ? 'Public Group' : 'Private Group'}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Owner:</Text>
                  <Text style={styles.infoValue}>{selectedGroup.owner}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Members:</Text>
                  <Text style={styles.infoValue}>{selectedGroup.members}</Text>
                </View>

                {selectedGroup.category && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Category:</Text>
                    <Text style={styles.infoValue}>{selectedGroup.category}</Text>
                  </View>
                )}
                
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>Description:</Text>
                  <Text style={styles.descriptionText}>{selectedGroup.description}</Text>
                </View>
                
                {/* Only show Join button for public groups that the user isn't already a member of */}
                {selectedGroup.type === 'public' && 
                  !myGroups.some(g => g.id === selectedGroup.id) && (
                  <TouchableOpacity 
                    style={styles.joinGroupButton}
                    onPress={() => handleJoinGroup(selectedGroup)}
                  >
                    <Text style={styles.actionButtonText}>Join Group</Text>
                  </TouchableOpacity>
                )}
                
                {/* Show leave button if the user is a member */}
                {myGroups.some(g => g.id === selectedGroup.id) && !selectedGroup.isUserOwner && (
                  <TouchableOpacity 
                    style={styles.leaveGroupButton}
                    onPress={() => handleLeaveGroup(selectedGroup)}
                  >
                    <Text style={styles.actionButtonText}>Leave Group</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setGroupInfoModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Owner Modal */}
      <Modal
        visible={ownerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOwnerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGroup && (
              <>
                <View style={styles.modalHeader}>
                  <MaterialIcons 
                    name={selectedGroup.icon as any} 
                    size={36} 
                    color={colors.light_blue} 
                    style={styles.modalIcon} 
                  />
                  <Text style={styles.modalTitle}>{selectedGroup.name}</Text>
                  <MaterialIcons name="star" size={24} color="gold" style={styles.modalOwnerStar} />
                </View>
                
                <Text style={styles.ownerBadge}>You are the owner of this group</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Type:</Text>
                  <Text style={styles.infoValue}>
                    {selectedGroup.type === 'public' ? 'Public Group' : 'Private Group'}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Members:</Text>
                  <Text style={styles.infoValue}>{selectedGroup.members}</Text>
                </View>

                {selectedGroup.category && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Category:</Text>
                    <Text style={styles.infoValue}>{selectedGroup.category}</Text>
                  </View>
                )}
                
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>Description:</Text>
                  <Text style={styles.descriptionText}>{selectedGroup.description}</Text>
                </View>
                
                <View style={styles.ownerActionsContainer}>
                  <Text style={styles.ownerActionsHeader}>Owner Actions:</Text>
                  
                  <TouchableOpacity 
                    style={styles.ownerActionButton}
                    onPress={() => {
                      setOwnerModalVisible(false);
                      setInviteModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="person-add" size={20} color="white" />
                    <Text style={styles.ownerActionText}>Invite Members</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.ownerActionButton}
                    onPress={() => alert('Edit Group functionality to be implemented')}
                  >
                    <MaterialIcons name="edit" size={20} color="white" />
                    <Text style={styles.ownerActionText}>Edit Group</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.ownerActionButton}
                    onPress={() => alert('Manage Members functionality to be implemented')}
                  >
                    <MaterialIcons name="group" size={20} color="white" />
                    <Text style={styles.ownerActionText}>Manage Members</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.ownerActionButton, styles.deleteButton]}
                    onPress={() => handleDeleteGroup(selectedGroup)}
                  >
                    <MaterialIcons name="delete" size={20} color="white" />
                    <Text style={styles.ownerActionText}>Delete Group</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setOwnerModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: colors.light_blue,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    width: '45%',
  },
  buttonText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderStyle: {
    padding: 10,
    backgroundColor: '#e9e9e9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionHeaderText: {
    fontSize: 18,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  groupIcon: {
    marginRight: 10,
  },
  groupName: {
    fontSize: 16,
    flex: 1,
  },
  ownerStar: {
    marginLeft: 5,
  },
  groupTypeTag: {
    backgroundColor: colors.light_blue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 5,
  },
  privateTag: {
    backgroundColor: '#666',
  },
  groupTypeText: {
    color: 'white',
    fontSize: 12,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 5,
  },
  categoryText: {
    color: '#555',
    fontSize: 12,
  },
  emptyText: {
    padding: 20,
    textAlign: 'center',
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalOwnerStar: {
    marginLeft: 5,
  },
  ownerBadge: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 4,
    color: colors.light_blue,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 80,
  },
  infoValue: {
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  descriptionLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    lineHeight: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 5,
  },
  selectedTypeOption: {
    backgroundColor: colors.light_blue,
    borderColor: colors.light_blue,
  },
  typeText: {
    marginLeft: 5,
    color: '#333',
  },
  selectedTypeText: {
    marginLeft: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  joinGroupButton: {
    backgroundColor: colors.light_blue,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  leaveGroupButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  membershipIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  membershipText: {
    color: 'green',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  ownerActionsContainer: {
    marginTop: 5,
    marginBottom: 20,
  },
  ownerActionsHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  ownerActionButton: {
    backgroundColor: colors.light_blue,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ownerActionText: {
    color: 'white',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  scanQRContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scanQRText: {
    fontSize: 16,
    color: '#555',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  generatedCode: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  roleSelector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleDropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
  },
  roleOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: colors.light_blue,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  createButton: {
    flex: 1,
    marginRight: 4,
  },
  inviteButton: {
    flex: 1,
    marginLeft: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default Relationships;