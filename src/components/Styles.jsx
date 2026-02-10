import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F8FA', // Light grey background for modern feel
    alignItems: 'center',
  },
  themeToggleButton: {
    position: 'absolute',
    top: 55, // Lowered slightly for better safe area clearance
    right: 25,
    width: 48,
    height: 48,
    borderRadius: 24, // Perfect circle
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    // Add distinct shadow for "floating" effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    // Add a subtle border
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  headerContainer: {
    marginTop: 90,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  categoryContainer: {
    width: '100%',
    marginVertical: 20,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a', // Darker black for better contrast
    marginBottom: 15,
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    flex: 0.48, // Two columns with gap
    borderRadius: 25,
    paddingVertical: 40,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    minHeight: 180,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // Subtle border for definition
  },
  cardText: {
    marginTop: 15,
    fontSize: 22, // Even larger
    color: '#ffffff',
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Text shadow for readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  disabledButton: {
    // REMOVED backgroundColor override to keep the color
    opacity: 0.4, // Just fade it out
    transform: [{ scale: 0.95 }], // Slightly shrink to indicate disabled
    elevation: 0,
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    opacity: 0.7,
    fontSize: 13,
    fontWeight: '600',
  },
  iconContainer: {
    marginBottom: 10,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)', // Border for the icon circle
  }
});

export default styles;
