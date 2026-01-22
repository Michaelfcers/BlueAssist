import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F8FA', // Light grey background for modern feel
    alignItems: 'center',
  },
  darkModeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  headerContainer: {
    marginTop: 80,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  categoryContainer: {
    width: '100%',
    marginVertical: 15,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333', // Dark text
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
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    minHeight: 160,
  },
  cardText: {
    marginTop: 15,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
    elevation: 0,
  },
  footerText: {
    position: 'absolute',
    bottom: 25,
    opacity: 0.6,
    fontSize: 12,
    fontWeight: '500',
  },
  iconContainer: {
    marginBottom: 5,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
  }
});

export default styles;
