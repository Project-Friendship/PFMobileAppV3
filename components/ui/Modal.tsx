import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  contentStyle?: ViewStyle;
  showCloseButton?: boolean;
  scrollable?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  animationType = 'slide',
  contentStyle,
  showCloseButton = true,
  scrollable = false,
}) => {
  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, contentStyle]}>
          {title && <Text style={styles.modalTitle}>{title}</Text>}

          <ContentWrapper>
            {children}
          </ContentWrapper>

          {showCloseButton && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default Modal;