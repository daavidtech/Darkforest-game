//
//  ContentView.swift
//  Darkforest
//
//  Created by Jaska on 11.2.2024.
//

import SwiftUI

struct ActivityItem: Identifiable {
    var id = UUID()
    var name: String
    var completedAt: Date
}

struct ActivityItemView: View {
    var item: ActivityItem
    @State private var now = Date()
    @State private var isHovering = false
    
    var body: some View {
        HStack {
            Text("Building")
            Text(timeRemaining(until: item.completedAt))
                .onAppear {
                    Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
                        now = Date() // Update the current time
                    }
                }
            Text("-")
            Text(item.name)
        }
        .background(isHovering ? Color.gray.opacity(0.2) : Color.clear)
        .onHover(perform: { hovering in
            isHovering = hovering
        })
    }
    
    private func timeRemaining(until endDate: Date) -> String {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.hour, .minute, .second], from: now, to: endDate)
        let hour = components.hour ?? 0
        let minute = components.minute ?? 0
        let second = components.second ?? 0
        return String(format: "%02d:%02d:%02d", hour, minute, second)
    }
}

struct TechTree: View {
	var body: some View {
		Text("Tech Tree")
	}
}

struct ActivityView: View {
    var items = [
        ActivityItem(name: "Library", completedAt: Calendar.current.date(byAdding: .minute, value: 5, to: Date())!),
        ActivityItem(name: "Barrack", completedAt: Calendar.current.date(byAdding: .minute, value: 5, to: Date())!)
    ]

	var body: some View {
		VStack {
                List(items) {item in
                    ActivityItemView(item: item)
                }
            }
            .frame(maxWidth: .infinity) // This line ensures the VStack takes the full width
            .padding()
	}
}

struct SlideNavigation: View {
    var pages: [AnyView]
    @State private var offset = 0.0
    @State private var lastOffset = 0.0
    @State private var pageIndex = 0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Image("background")
                    .resizable()
                    .clipped()
                    .edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
                HStack {
                    ForEach(0..<pages.count, id: \.self) { index in
                        VStack {
                            pages[index]
                                .frame(width: geometry.size.width, height: geometry.size.height)
                        }
                        //.background()
                    }
                }
            }
            .offset(x: lastOffset + offset - (UIScreen.main.bounds.width * Double(pageIndex)))
            .gesture(
                DragGesture()
                    .onChanged({ v in
                        offset = v.translation.width
                    })
                    .onEnded {gesture in
                        if pageIndex < pages.count - 1 && offset < -UIScreen.main.bounds.width / 2 {
                            withAnimation {
                                pageIndex += 1
                            }
                        }
                        
                        if pageIndex > 0 && offset > UIScreen.main.bounds.width / 2 {
                            withAnimation {
                                pageIndex -= 1
                            }
                        }
                        
                        lastOffset = offset + lastOffset
                        offset = 0.0
                        
                        withAnimation {
                            lastOffset = 0
                        }
                    }
            )
            //.frame(width: geometry.size.width, height: geometry.size.height)
        }
    }
}

struct ContentView: View {
    @State private var offset = 0.0
	@State private var selection: String = "Activity"
    @GestureState private var dragOffset = CGSize.zero
    var body: some View {
        SlideNavigation(pages: [
            AnyView(ActivityView()),
            AnyView(TechTree())
        ])
        
    }
}

/*ZStack {
    Image("background")
        .resizable()
        .clipped()
        .edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
    ActivityView()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.red) // Background for visibility
        //.offset(x: selection == "Activity" ? 0 : -UIScreen.main.bounds.width)
        .offset(x: dragOffset.width)

    TechTree()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.blue) // Background for visibility
        //.offset(x: selection == "TechTree" ? UIScreen.main.bounds.width : 0)
        .offset(x: dragOffset.width - (selection == "TechTree" ? UIScreen.main.bounds.width : 0))
}
.gesture(
    DragGesture()
        .updating($dragOffset, body: { (value, state, _) in
            state = value.translation
            print("Drag offset: \(value.translation)")
        })
        .onEnded {gesture in
            /*if gesture.translation.width < -100 {
                selection = "Activity"
            } else if gesture.translation.width > 100 {
                selection = "TechTree"
            }*/
            
        }
)*/
/*.overlay(
    // Toggle button to switch views
    VStack {
        Spacer()
        Button(action: {
            // Toggle the state to switch views
            selection = selection == "Activity" ? "TechTree" : "Activity"
        }) {
            Text(selection == "Activity" ? "Show Activity View" : "Show Tech Tree")
                .foregroundColor(.white)
                .padding()
                .background(Color.blue)
                .cornerRadius(10)
        }
        .padding()
}, alignment: .bottom)*/

#Preview {
    ContentView()
}
