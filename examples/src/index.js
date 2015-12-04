var StyleSheet = require('../lib');

// now you can create the styles
var styles = StyleSheet.create({
  card: {
    margin: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 3
  },
  profilePicture: {
    width: 40,
    height: 40,
    backgroundColor: '#cccccc',
    marginRight: 8,
    marginBottom: 8,
    marginVertical: 20
  },
  name: {
    color: '#3B5998',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#9197A3',
  },
  header: {
    flexDirection: 'row',
  },  
  bling: {
    marginTop: 8,
    color: '#6D84B4',
    fontSize: 13,
  }
});

console.log(StyleSheet.resolve([styles.profilePicture, {marginBottom: 100}]));
console.log(StyleSheet.renderToString());