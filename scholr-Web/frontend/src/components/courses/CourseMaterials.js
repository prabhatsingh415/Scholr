import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
const CourseMaterials = () => {
    const { courseId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const { data } = await api.getCourseMaterials(courseId);
                setMaterials(data.data);
            }
            catch (err) {
                setError("Failed to fetch course materials");
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, [courseId]);
    if (loading)
        return <div>Loading materials...</div>;
    if (error)
        return <div className="text-red-500">{error}</div>;
    return (<div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Course Materials</h2>
      
      {materials.length === 0 ? (<p>No materials available for this course yet.</p>) : (<div className="space-y-4">
          {materials.map((material) => (<div key={material.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="text-blue-600"/>
                  </div>
                  <div>
                    <h3 className="font-semibold">{material.title}</h3>
                    <p className="text-sm text-gray-600">{material.description}</p>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                      <span>{new Date(material.upload_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{Math.round(material.file_size / 1024)} KB</span>
                    </div>
                  </div>
                </div>
                
                <a href={`${process.env.REACT_APP_API_URL}/${material.file_path}`} download className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                  <Download className="w-5 h-5"/>
                  <span>Download</span>
                </a>
              </div>
            </div>))}
        </div>)}
    </div>);
};
export default CourseMaterials;
