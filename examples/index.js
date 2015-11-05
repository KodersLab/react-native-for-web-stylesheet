// you can then require the file manually, or take advantage of webpack's resolve alias feature!
var StyleSheet = require('./StyleSheet');

// import react
var React = require('react');
var {render} = require('react-dom');

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

// you can now add support for the react-native like style property in your components using StyleSheet.resolve(styles)
class View extends React.Component{
	render(){
		// extract the needed props
		var {style, children, ...props} = this.props;
		// then use the spread over ...StyleSheet.resolve to automatically append className and style!
		return <div {...StyleSheet.resolve(style)} {...props}>{children}</div>;
	}
}

class Text extends React.Component{
	render(){
		// extract the needed props
		var {style, children, ...props} = this.props;
		// then use the spread over ...StyleSheet.resolve to automatically append className and style!
		return <span {...StyleSheet.resolve(style, {isBlockElement: false})} {...props}>{children}</span>;
	}
}

// simple demo
var StyleDemo = React.createClass({
  render: function() {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.profilePicture} />
          <View style={{flex: 1}}>
            <Text style={styles.name}>Christopher Chedeau</Text>
            <Text style={styles.subtitle}>August 28 at 9:46pm &middot; Paris, France</Text>
          </View>
        </View>
        <View>
          <Text>'react js' search on Twitter returns 96 results in the past 24 hours. I declare bankruptcy!</Text>
          <Text style={styles.bling}>Like &middot; Comment &middot; Share</Text>
        </View>
      </View>
    );
  }
});

// render your dom application
render(<StyleDemo />, document.getElementById('app'));
// and then render your stylesheet!
StyleSheet.renderToStyleTag(document.getElementById('stylesheet'));

// EXTRA
// are you using lazy module loading?
// you can subscribe to your StyleSheet and update the css code when new styles are created!
StyleSheet.subscribe(() => StyleSheet.renderToStyleTag(document.getElementById('stylesheet')));

