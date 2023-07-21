import style from  '../styles/Home.module.css';


const ResourcesList = ({ resources }) => {
	return (
	  <div className={style.resourceslist}>
		<h2>Resources</h2>
		<ul>
		  {Object.entries(resources).map(([resource, value]) => (
			<li key={resource}>
			  {resource}: {value}
			</li>
		  ))}
		</ul>
	  </div>
	);
  };
  
  export default ResourcesList;