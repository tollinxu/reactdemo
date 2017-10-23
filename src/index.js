import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const data = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

class SearchBar extends React.Component{
	constructor(props){
		super(props);
		this.onChanged = this.onChanged.bind(this);
		this.radioChange = this.radioChange.bind(this);
	}
	onChanged(source){
		this.props.onFilterChange({ 'productName':source.target.value,
									'stocked':this.props.filter.stocked
		});
	}
	radioChange(checkbox){
		this.props.onFilterChange({'stocked':checkbox.target.checked,
									'productName':this.props.filter.productName
								});
	}
	render(){
		return (
				<div>
					<div>
						<input type="text" onChange={this.onChanged} value={this.props.filter.productName} name='productName' placeholder="Search..." /> 
					</div>
					<div>
						<input type="checkbox" onChange={this.radioChange} checked={this.props.filter.stocked}  name='stocked'/> 
						<span>Only show products in stock</span>
					</div>
				</div>
			)
	}
}

class ProductRow extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
				<div>
					<label>{this.props.productName}</label>
					<label>{this.props.productPrice}</label>
				</div>
			)
	}
}

class ProductCategoryRow extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		
		const rows = this.props.products.map((product, index)=>			
			<ProductRow key={product.name} productName={product.name} productPrice={product.price} />
		)
		return (
				<div>
					<span>{this.props.categoryName}</span>

					{rows}
				</div>
			)
	}
}

class ProductTable extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const list = new Array();
		for (var dict in this.props.productDict) {
			list.push({categoryName:dict, products: this.props.productDict[dict]});
		}
		return (
				<div>
					<div>
						<span>Name</span> <span>Price</span> 
					</div>
					{list.map((cc)=><ProductCategoryRow key={cc.categoryName} categoryName={cc.categoryName} products={cc.products}/>)}										
				</div>
			)
	}
}

///to Dictionary
function convertToDictionary(products, filter){	
	var dict={};
	if(!products){
		return dict;
	}
	
	for (var prod in products) {	
		var list = dict[products[prod].category];
		if(!list){
			list = new Array();
		}
		var product = products[prod];
		if(!productNameFilter(product, filter.productName)){
			continue;
		}

		if(!productStocked(product, filter.stocked)){
			continue;
		}

		list.push(products[prod]);		
		dict[products[prod].category] = list;
	};
	return dict;
}

/// stocked filter
function productStocked(product, stocked){
	if(!stocked){
		return true;
	}

	if(!product){
		return false;
	}

	return product.stocked === stocked;
}

///
///to filter by product Name
///
function productNameFilter(product, productName){
	if(!productName){
		return true;
	}

	if(!product || !product.name){
		return false;
	}

	return product.name.indexOf(productName) >=0;
}

class FilterableProductTable extends React.Component{
	constructor(props){
		super(props);	
		let filter = {
			productName:'',
			stocked:false,
		}
		this.state={
			productDict:convertToDictionary(this.props.products, filter),
			filter:filter,			
		};
		this.filterChange = this.filterChange.bind(this);
	}

	filterChange(source){
		this.setState({filter:source});
		this.setState({productDict:convertToDictionary(this.props.products, source)});
	}

	render(){
		return (
				<div>
					<SearchBar filter={this.state.filter} onFilterChange={this.filterChange}></SearchBar>
					<ProductTable productDict={this.state.productDict}> </ProductTable>
				</div>
			)
	}
}

ReactDOM.render(
    <FilterableProductTable products={data}></FilterableProductTable>,
    document.getElementById('root')
  );