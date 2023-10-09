import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  categoryContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 15,
    width: '100%',
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 50,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    flex: 0.70,
    margin: 10,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    minHeight: 150,
    
  },
  cardText: {
    marginTop: 10,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    
  },
  // Estilos para botones
  button: {
    backgroundColor: '#32a852',
    paddingVertical: 12, // Ajusta la altura vertical
    paddingHorizontal: 20,
    borderRadius: 8, // Aumenta el radio del borde
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Sutil sombreado
    minHeight: 48, // Altura mínima para mantener un tamaño consistente
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  // Otros estilos...
});

export default styles;
